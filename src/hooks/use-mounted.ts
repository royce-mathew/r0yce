import * as React from "react"

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function useMounted() {
  return React.useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  )
}
