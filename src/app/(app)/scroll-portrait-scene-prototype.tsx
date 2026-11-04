"use client"

import Image from "next/image"
import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from "react"
import * as THREE from "three"
import type { ScrollWork } from "./scroll-study-types"

export type ScrollSceneHandle = { setProgress: (progress: number) => void }

type Props = { mode: "archive" | "sculpture"; works: ScrollWork[] }

export const ScrollPortraitScene = forwardRef<ScrollSceneHandle, Props>(function ScrollPortraitScene({ mode, works }, ref) {
  const host = useRef<HTMLDivElement>(null)
  const update = useRef<(progress: number) => void>(() => {})
  const progress = useRef(0)

  useImperativeHandle(ref, () => ({ setProgress(value) { progress.current = value; update.current(value) } }), [])

  useLayoutEffect(() => {
    const element = host.current!
    const media = matchMedia("(prefers-reduced-motion: reduce)")
    let dispose: (() => void) | undefined
    let cancelled = false
    function mount() {
      if (media.matches) return
      const canvas = document.createElement("canvas")
      canvas.setAttribute("aria-hidden", "true")
      const context = canvas.getContext("webgl2", { alpha: true, antialias: true })
      if (!context) { element.dataset.webgl = "unavailable"; return }
      const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true, powerPreference: "low-power" })
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
      renderer.setClearColor(0x000000, 0)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      element.append(canvas)
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(35, 1, .1, 100)
      const gallery = new THREE.Group()
      scene.add(gallery)
      scene.add(new THREE.AmbientLight(0xffffff, 2.2))
      const key = new THREE.DirectionalLight(0xffeee0, 5)
      key.position.set(-3, 5, 5)
      scene.add(key)
      const rim = new THREE.DirectionalLight(mode === "archive" ? 0x819dff : 0xe9aa79, 5)
      rim.position.set(4, 1, -2)
      scene.add(rim)
      const textures: THREE.Texture[] = []
      const geometries: THREE.BufferGeometry[] = []
      const materials: THREE.Material[] = []
      const loader = new THREE.TextureLoader()
      function panel(src: string, width: number, height: number, x: number, y: number, z: number, angle: number) {
        const group = new THREE.Group()
        group.position.set(x, y, z)
        group.rotation.y = angle
        const frameGeometry = new THREE.BoxGeometry(width + .1, height + .1, .08)
        const frameMaterial = new THREE.MeshStandardMaterial({ color: mode === "archive" ? 0xd2d5dc : 0x85705b, metalness: .65, roughness: .28 })
        geometries.push(frameGeometry)
        materials.push(frameMaterial)
        group.add(new THREE.Mesh(frameGeometry, frameMaterial))
        const texture = loader.load(src, () => update.current(progress.current))
        texture.colorSpace = THREE.SRGBColorSpace
        texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy())
        textures.push(texture)
        const imageGeometry = new THREE.PlaneGeometry(width, height)
        const imageMaterial = new THREE.MeshBasicMaterial({ map: texture })
        geometries.push(imageGeometry)
        materials.push(imageMaterial)
        const image = new THREE.Mesh(imageGeometry, imageMaterial)
        image.position.z = .046
        group.add(image)
        gallery.add(group)
        return group
      }
      const portrait = panel("/images/hero-manga-portrait.png", 2.45, 2.61, 0, 0, 0, -.12)
      const orbit = new THREE.Group()
      if (mode === "archive") {
        works.forEach((work, index) => panel(work.imageSrc, 3.15, 1.98, 3.8 + index * 3.9, -.1, -.8 - index * .55, -.14 + index * .07))
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-5, -1.65, 0), new THREE.Vector3(13, -1.65, -2)])
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x4a5267 })
        geometries.push(lineGeometry)
        materials.push(lineMaterial)
        gallery.add(new THREE.Line(lineGeometry, lineMaterial))
      } else {
        gallery.add(orbit)
        const ringGeometry = new THREE.TorusGeometry(1.92, .065, 12, 128)
        const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xe1c6a2, metalness: .82, roughness: .22 })
        geometries.push(ringGeometry)
        materials.push(ringMaterial)
        const ring = new THREE.Mesh(ringGeometry, ringMaterial)
        ring.rotation.set(.32, .42, -.4)
        orbit.add(ring)
        const secondRing = new THREE.Mesh(ringGeometry, ringMaterial)
        secondRing.scale.setScalar(1.13)
        secondRing.rotation.set(-.5, -.55, .48)
        orbit.add(secondRing)
        portrait.scale.setScalar(.91)
      }
      let renders = 0
      function render(value: number) {
        if (cancelled) return
        const mobile = element.clientWidth < 600
        if (mode === "archive") {
          const offset = mobile ? 0 : -1.6
          const travel = offset + value * ((works.length ? 3.8 + (works.length - 1) * 3.9 : 0) - offset)
          camera.position.set(travel, .15 + Math.sin(value * Math.PI) * .22, mobile ? 8.8 : 6.5)
          camera.lookAt(travel, 0, -.3)
          portrait.rotation.y = -.12 - value * .3
        } else {
          camera.position.set(.2 + value * .75, .15 - value * .25, mobile ? 9.8 - value : 7.4 - value * 1.1)
          camera.lookAt(0, 0, 0)
          gallery.rotation.set(value * -.12, value * -.45, value * .09)
          orbit.rotation.z = value * .65
          portrait.rotation.y = -.12 + value * .26
        }
        renderer.render(scene, camera)
        element.dataset.webgl = "ready"
        element.dataset.renders = String(++renders)
      }
      const resize = new ResizeObserver(() => {
        renderer.setSize(element.clientWidth, element.clientHeight)
        camera.aspect = element.clientWidth / Math.max(1, element.clientHeight)
        camera.updateProjectionMatrix()
        render(progress.current)
      })
      resize.observe(element)
      update.current = render
      dispose = () => {
        resize.disconnect()
        update.current = () => {}
        textures.forEach(texture => texture.dispose())
        geometries.forEach(geometry => geometry.dispose())
        materials.forEach(material => material.dispose())
        renderer.dispose()
        renderer.forceContextLoss()
        canvas.remove()
        delete element.dataset.webgl
      }
    }
    function reset() {
      dispose?.()
      dispose = undefined
      if (!media.matches) void mount()
    }
    media.addEventListener("change", reset)
    void mount()
    return () => { cancelled = true; media.removeEventListener("change", reset); dispose?.() }
  }, [mode, works])

  return <div className={`scroll-portrait-scene scroll-portrait-scene-${mode}`} ref={host}>
    <Image className="scroll-portrait-fallback" src="/images/hero-manga-portrait.png" width={495} height={527} priority alt="Royce Mathew" sizes="(max-width: 760px) 76vw, 38vw" />
  </div>
})
