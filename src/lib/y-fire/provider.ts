import { FirebaseApp } from "firebase/app"
import {
  Bytes,
  collection,
  doc,
  Firestore,
  getFirestore,
  onSnapshot,
  setDoc,
  Timestamp,
  Unsubscribe,
} from "firebase/firestore"
import { ObservableV2 } from "lib0/observable"
import * as awarenessProtocol from "y-protocols/awareness"
import * as Y from "yjs"

import { auth } from "../firebase/client"
import { createGraph } from "./graph"
import { deleteInstance, initiateInstance, refreshPeers } from "./utils"
import { WebRtc } from "./webrtc"

export interface Parameters {
  firebaseApp: FirebaseApp
  ydoc: Y.Doc
  path: string
  maxUpdatesThreshold?: number
  maxWaitTime?: number
  maxWaitFirestoreTime?: number
}

interface PeersRTC {
  receivers: {
    [key: string]: WebRtc
  }
  senders: {
    [key: string]: WebRtc
  }
}

const origin = "origin:firebase/update" // make sure this does not coincide with UID

/**
 * FireProvider class that handles firestore data sync and awareness
 * based on webRTC.
 * @param firebaseApp Firestore instance
 * @param ydoc ydoc
 * @param path path to the firestore document (ex. collection/documentuid)
 * @param maxUpdatesThreshold maximum number of updates to wait for before sending updates to peers
 * @param maxWaitTime maximum miliseconds to wait before sending updates to peers
 * @param maxWaitFirestoreTime miliseconds to wait before syncing this client's update to firestore
 */
export class FireProvider extends ObservableV2<any> {
  readonly doc: Y.Doc
  awareness: awarenessProtocol.Awareness
  readonly documentPath: string
  readonly firebaseApp: FirebaseApp
  readonly db: Firestore
  uid?: string
  timeOffset: number = 0 // offset to server time in mili seconds

  clients: string[] = []
  peersReceivers: Set<string> = new Set([])
  peersSenders: Set<string> = new Set([])

  peersRTC: PeersRTC = {
    receivers: {},
    senders: {},
  }

  cache?: Uint8Array | null
  maxCacheUpdates: number = 20
  cacheUpdateCount: number = 0
  cacheTimeout?: string | number | NodeJS.Timeout
  maxRTCWait: number = 100
  firestoreTimeout?: string | number | NodeJS.Timeout
  maxFirestoreWait: number = 3000

  firebaseDataLastUpdatedAt: number = new Date().getTime()

  instanceConnection: ObservableV2<any> = new ObservableV2()
  recreateTimeout?: string | number | NodeJS.Timeout

  private unsubscribeData?: Unsubscribe
  private unsubscribeMesh?: Unsubscribe

  get clientTimeOffset() {
    return this.timeOffset
  }

  metadata: {
    [key: string]: any
  } = {}

  ready: boolean = false
  public onReady?: () => void
  public onDeleted?: () => void
  public onSaving?: (status: boolean) => void
  public onSetMetadata?: (metadata: { [key: string]: any }) => void

  // private initiateHandler: () => void;
  private destroyHandler: () => void

  init = async () => {
    this.trackData() // initiate this before creating instance, so that users with read permissions can also view the document
    try {
      const data = await initiateInstance(this.db, this.documentPath)
      this.instanceConnection.on("closed", this.trackConnections)
      this.uid = data.uid
      this.timeOffset = data.offset
      this.initiateHandler()
      addEventListener("beforeunload", this.destroy) // destroy instance on window close
    } catch (error) {
      this.consoleHandler("Could not connect to a peer network.")
      this.kill(true) // destroy provider but keep the read-only stream alive
    }
  }

  initiateHandler = () => {
    this.consoleHandler("FireProvider initiated!")
    this.awareness.on("update", this.awarenessUpdateHandler)
    // We will track the mesh document on Firestore to
    // keep track of selected peers
    this.trackMesh()
    this.doc.on("update", this.updateHandler)
  }

  trackData = () => {
    // Whenever there are changes to the firebase document
    // pull the changes and merge them to the current
    // yjs document
    if (this.unsubscribeData) this.unsubscribeData()
    this.unsubscribeData = onSnapshot(
      doc(this.db, this.documentPath),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data()
          if (data && data.content) {
            this.firebaseDataLastUpdatedAt = new Date().getTime()
            this.metadata = data.metadata
            this.onSetMetadata && this.onSetMetadata(data.metadata)
            try {
              const content = data.content?.toUint8Array()
              Y.applyUpdate(this.doc, content, origin)
            } catch (error) {
              // This can occur when toUint8Array() is called on a null value
              this.consoleHandler("Error applying update", error)
            }
          }
          if (!this.ready) {
            if (this.onReady) {
              this.onReady()
              this.ready = true
            }
          }
        }
      },
      (error) => {
        this.consoleHandler("Firestore sync error", error)
        if (error.code === "permission-denied") {
          if (this.onDeleted) this.onDeleted()
        }
      }
    )
  }

  trackMesh = () => {
    if (this.unsubscribeMesh) this.unsubscribeMesh()

    this.unsubscribeMesh = onSnapshot(
      collection(this.db, `${this.documentPath}/instances`),
      (snapshot) => {
        this.clients = []
        snapshot.forEach((doc) => {
          this.clients.push(doc.id)
        })
        const mesh = createGraph(this.clients)

        // a -> b, c; a is the sender and b, c are receivers
        const receivers: string[] = mesh[this.uid!] // this user's receivers
        const senders: string[] = Object.keys(mesh).filter(
          (v, i) => mesh[v] && mesh[v].length && mesh[v].includes(this.uid!)
        ) // this user's senders

        this.peersReceivers = this.connectToPeers(
          receivers,
          this.peersReceivers,
          true
        )
        this.peersSenders = this.connectToPeers(
          senders,
          this.peersSenders,
          false
        )
      },
      (error) => {
        this.consoleHandler("Creating peer mesh error", error)
      }
    )
  }

  reconnect = () => {
    if (this.recreateTimeout) clearTimeout(this.recreateTimeout)
    this.recreateTimeout = setTimeout(async () => {
      this.consoleHandler("triggering reconnect")
      this.destroy()
      this.init()
    }, 200)
  }

  trackConnections = async () => {
    const clients = this.clients.length
    let connected = 0
    Object.values(this.peersRTC.receivers).forEach((receiver) => {
      if (receiver.connection !== "closed") connected++
    })
    Object.values(this.peersRTC.senders).forEach((sender) => {
      if (sender.connection !== "closed") connected++
    })
    if (clients > 1 && connected <= 0) {
      // we have lost connection with all peers
      // trigger re-generation of the graph/mesh
      this.reconnect()
    }
  }

  connectToPeers = (
    newPeers: string[],
    oldPeers: Set<string>,
    isCaller: boolean
  ) => {
    if (!newPeers) return new Set([])
    // We must:
    // 1. remove obselete peers
    // 2. add new peers
    // 3. no change to same peers
    const getNewPeers = refreshPeers(newPeers, oldPeers)
    const peersType = isCaller ? "receivers" : "senders"
    if (!this.peersRTC[peersType]) this.peersRTC[peersType] = {}
    if (getNewPeers.obselete && getNewPeers.obselete.length) {
      // Old peers, remove them
      getNewPeers.obselete.forEach(async (peerUid) => {
        if (this.peersRTC[peersType][peerUid]) {
          await this.peersRTC[peersType][peerUid].destroy()
          delete this.peersRTC[peersType][peerUid]
        }
      })
    }
    if (getNewPeers.new && getNewPeers.new.length) {
      // New peers, initiate new connection to them
      getNewPeers.new.forEach(async (peerUid) => {
        if (this.peersRTC[peersType][peerUid]) {
          await this.peersRTC[peersType][peerUid].destroy()
          delete this.peersRTC[peersType][peerUid]
        }
        this.peersRTC[peersType][peerUid] = new WebRtc({
          firebaseApp: this.firebaseApp,
          ydoc: this.doc,
          awareness: this.awareness,
          instanceConnection: this.instanceConnection,
          documentPath: this.documentPath,
          uid: this.uid!,
          peerUid,
          isCaller,
        })
      })
    }
    return new Set(newPeers)
  }

  sendDataToPeers = ({
    from,
    message,
    data,
  }: {
    from: unknown
    message: unknown
    data?: Uint8Array | null
  }) => {
    if (this.peersRTC) {
      if (this.peersRTC.receivers) {
        Object.keys(this.peersRTC.receivers).forEach((receiver) => {
          if (receiver !== from) {
            const rtc = this.peersRTC.receivers[receiver]
            rtc.sendData({ message, data })
          }
        })
      }
      if (this.peersRTC.senders) {
        Object.keys(this.peersRTC.senders).forEach((sender) => {
          if (sender !== from) {
            const rtc = this.peersRTC.senders[sender]
            rtc.sendData({ message, data })
          }
        })
      }
    }
  }

  saveToFirestore = () => {
    try {
      // current document to firestore
      const ref = doc(this.db, this.documentPath)
      setDoc(
        ref,
        {
          metadata: {
            ...this.metadata,
            updatedBy: auth.currentUser?.displayName || "anonymous",
            lastUpdated: Timestamp.now(),
          },
          content: Bytes.fromUint8Array(Y.encodeStateAsUpdate(this.doc)),
        },
        { merge: true }
      )
    } catch (error) {
      this.consoleHandler("error saving to firestore", error)
    } finally {
      if (this.onSaving) this.onSaving(false)
    }
  }

  sendToFirestoreQueue = () => {
    // if cache settles down, save document to firebase
    if (this.firestoreTimeout) clearTimeout(this.firestoreTimeout) // kill other save processes first
    if (this.onSaving) this.onSaving(true)
    this.firestoreTimeout = setTimeout(() => {
      if (
        new Date().getTime() - this.firebaseDataLastUpdatedAt >
        this.maxFirestoreWait
      ) {
        this.saveToFirestore()
      } else {
        // A peer recently saved to firebase, let's wait a bit
        this.sendToFirestoreQueue()
      }
    }, this.maxFirestoreWait)
  }

  sendCache = (from: string) => {
    this.sendDataToPeers({
      from,
      message: null,
      data: this.cache,
    })
    this.cache = null
    this.cacheUpdateCount = 0
    this.sendToFirestoreQueue() // save to firestore
  }

  sendToQueue = ({ from, update }: { from: unknown; update: Uint8Array }) => {
    if (from === this.uid!) {
      // this update was from this user
      if (this.cacheTimeout) clearTimeout(this.cacheTimeout)

      this.cache = this.cache ? Y.mergeUpdates([this.cache, update]) : update
      this.cacheUpdateCount++

      if (this.cacheUpdateCount >= this.maxCacheUpdates) {
        // if the cache was already merged 20 times (this.maxCacheUpdates), send
        // the updates in cache to the peers
        this.sendCache(from)
      } else {
        // Wait to see if the user make other changes
        // if the user does not make changes for the next 500ms
        // send updates in cache to the peers
        this.cacheTimeout = setTimeout(() => {
          this.sendCache(from)
        }, this.maxRTCWait)
      }
    } else {
      // this update was from a peer, not this user
      this.sendDataToPeers({
        from,
        message: null,
        data: update,
      })
    }
  }

  updateHandler = (update: Uint8Array, origin: any) => {
    if (origin !== this.uid) {
      // Only allow updates typed by the user, and updates sent by peers
      // Disallow repeat updates that were sent back by the peers
      Y.applyUpdate(this.doc, update, this.uid) // the third parameter sets the transaction-origin

      this.sendToQueue({
        from: typeof origin === "string" ? origin : this.uid,
        update,
      })
    }
  }

  awarenessUpdateHandler = (
    {
      added,
      updated,
      removed,
    }: { added: number[]; updated: number[]; removed: number[] },
    origin: unknown
  ) => {
    const changedClients = added.concat(updated).concat(removed)
    this.sendDataToPeers({
      from: origin !== "local" ? origin : this.uid,
      message: "awareness",
      data: awarenessProtocol.encodeAwarenessUpdate(
        this.awareness,
        changedClients
      ),
    })
  }

  consoleHandler = (message: any, data: any = null) => {
    // console.log(
    //   "Provider:",
    //   this.documentPath,
    //   `this client: ${this.uid}`,
    //   message,
    //   data
    // )
  }

  // use destroy directly if you don't need arguements
  // otherwise use kill
  destroy = () => {
    // we have to create a separate function here
    // because beforeunload only takes this.destroy
    // and not this.destroy() or with this.destroy(args)
    this.kill()
  }

  kill = (keepReadOnly: boolean = false) => {
    this.instanceConnection.destroy()
    removeEventListener("beforeunload", this.destroy)
    if (this.recreateTimeout) clearTimeout(this.recreateTimeout)
    if (this.cacheTimeout) clearTimeout(this.cacheTimeout)
    if (this.firestoreTimeout) clearTimeout(this.firestoreTimeout)
    this.doc.off("update", this.updateHandler)
    this.awareness.off("update", this.awarenessUpdateHandler)
    deleteInstance(this.db, this.documentPath, this.uid!)
    if (this.unsubscribeData && !keepReadOnly) {
      this.unsubscribeData()
      delete this.unsubscribeData
    }
    if (this.unsubscribeMesh) {
      this.unsubscribeMesh()
      delete this.unsubscribeMesh
    }
    if (this.peersRTC) {
      if (this.peersRTC.receivers) {
        Object.values(this.peersRTC.receivers).forEach((receiver) =>
          receiver.destroy()
        )
      }
      if (this.peersRTC.senders) {
        Object.values(this.peersRTC.senders).forEach((sender) =>
          sender.destroy()
        )
      }
    }
    this.ready = false
    super.destroy()
  }

  constructor({
    firebaseApp,
    ydoc,
    path,
    maxUpdatesThreshold,
    maxWaitTime,
    maxWaitFirestoreTime,
  }: Parameters) {
    super()

    // Initializing values
    this.firebaseApp = firebaseApp
    this.db = getFirestore(this.firebaseApp)
    this.doc = ydoc
    this.documentPath = path
    if (maxUpdatesThreshold) this.maxCacheUpdates = maxUpdatesThreshold
    if (maxWaitTime) this.maxRTCWait = maxWaitTime
    if (maxWaitFirestoreTime) this.maxFirestoreWait = maxWaitFirestoreTime
    this.awareness = new awarenessProtocol.Awareness(this.doc)

    // Initialize the provider
    const init = this.init()

    this.destroyHandler = () => {
      this.destroy()
    }
  }
}
