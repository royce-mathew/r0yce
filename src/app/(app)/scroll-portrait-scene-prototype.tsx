"use client"

import Image from "next/image"
import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from "react"
import * as THREE from "three"

export type ScrollSceneHandle = { setProgress: (progress: number) => void }
type Props = { mode: "archive" | "sculpture" }

export const ScrollPortraitScene = forwardRef<ScrollSceneHandle, Props>(function ScrollPortraitScene({ mode }, ref) {
  const host = useRef<HTMLDivElement>(null)
  const update = useRef<(progress: number) => void>(() => {})
  const progress = useRef(0)
  useImperativeHandle(ref, () => ({ setProgress(value) { progress.current = value; update.current(value) } }), [])

  useLayoutEffect(() => {
    const element = host.current!
    const media = matchMedia("(prefers-reduced-motion: reduce)")
    let dispose: (() => void) | undefined
    function mount() {
      if (media.matches) return
      const canvas = document.createElement("canvas")
      canvas.setAttribute("aria-hidden", "true")
      let renderer: THREE.WebGLRenderer
      try {
        const context = canvas.getContext("webgl2", { alpha: true, antialias: true })
        if (!context) { element.dataset.webgl = "unavailable"; return }
        renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true, powerPreference: "low-power" })
      } catch { element.dataset.webgl = "unavailable"; return }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
      renderer.setClearColor(0x000000, 0)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      element.append(canvas)
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(35, 1, .1, 100)
      const panels = new THREE.Group()
      scene.add(panels)
      const geometries: THREE.BufferGeometry[] = []
      const frameGeometry = new THREE.BoxGeometry(1, 1, 1)
      geometries.push(frameGeometry)
      const frameMaterial = new THREE.MeshBasicMaterial({ color: mode === "archive" ? 0xf1f0eb : 0xdfd7c7 })
      const inkMaterial = new THREE.MeshBasicMaterial({ color: mode === "archive" ? 0x101116 : 0x151411 })
      let active = true
      let loaded = false
      let lost = false
      let renders = 0
      const texture = new THREE.TextureLoader().load("/images/hero-manga-portrait.png", () => {
        if (!active) { texture.dispose(); return }
        loaded = true
        render(progress.current)
      }, undefined, () => { if (active) element.dataset.webgl = "unavailable" })
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy())
      const imageMaterial = new THREE.MeshBasicMaterial({ map: texture })
      function panel(width: number, height: number, x: number, y: number, z: number, angle: number, crop: [number, number, number, number]) {
        const group = new THREE.Group()
        group.position.set(x, y, z)
        group.rotation.set(0, angle, mode === "archive" ? 0 : angle * .15)
        const frame = new THREE.Mesh(frameGeometry, frameMaterial)
        frame.scale.set(width + .08, height + .08, .07)
        group.add(frame)
        const ink = new THREE.Mesh(frameGeometry, inkMaterial)
        ink.scale.set(width + .025, height + .025, .075)
        group.add(ink)
        const geometry = new THREE.PlaneGeometry(width, height)
        const uv = geometry.getAttribute("uv")
        for (let index = 0; index < uv.count; index++) uv.setXY(index, crop[0] + uv.getX(index) * crop[2], crop[1] + uv.getY(index) * crop[3])
        geometries.push(geometry)
        const image = new THREE.Mesh(geometry, imageMaterial)
        image.position.z = .04
        group.add(image)
        panels.add(group)
        return group
      }
      const portrait = panel(2.3, 2.45, mode === "archive" ? .6 : .15, 0, 0, -.08, [0, 0, 1, 1])
      if (mode === "archive") {
        panel(2.65, .74, .45, 1.84, -.65, .08, [.12, .48, .76, .2])
        panel(.8, 2.65, 2.38, -.03, -.85, -.18, [.35, .1, .3, .83])
        panel(1.35, .65, -1.15, -1.53, .35, .12, [.45, .3, .45, .24])
      } else {
        panel(1.75, .55, -.64, 1.75, -.55, .12, [.17, .48, .64, .18])
        panel(.55, 1.48, 1.87, -.5, -.65, -.18, [.42, .12, .22, .64])
      }
      function render(value: number) {
        if (!active || lost) return
        const mobile = element.clientWidth < 600
        if (mode === "archive") {
          camera.position.set(-.2 + value * 1.05, .15 + value * .2, (mobile ? 10.2 : 9.1) - value * 1.05)
          camera.lookAt(.65 + value * .25, .1, -.2)
          panels.rotation.y = -.12 + value * .24
          portrait.rotation.y = -.08 + value * .15
        } else {
          camera.position.set(.1 + value * .35, .2 - value * .15, (mobile ? 9.8 : 8.3) - value * .45)
          camera.lookAt(.4, .25, 0)
          panels.rotation.set(value * -.04, value * -.16, value * .025)
        }
        renderer.render(scene, camera)
        if (loaded) element.dataset.webgl = "ready"
        element.dataset.renders = String(++renders)
      }
      function contextLost(event: Event) {
        event.preventDefault()
        lost = true
        element.dataset.webgl = "unavailable"
      }
      function contextRestored() { lost = false; render(progress.current) }
      canvas.addEventListener("webglcontextlost", contextLost)
      canvas.addEventListener("webglcontextrestored", contextRestored)
      const resize = new ResizeObserver(() => {
        renderer.setSize(element.clientWidth, Math.max(1, element.clientHeight))
        camera.aspect = element.clientWidth / Math.max(1, element.clientHeight)
        camera.updateProjectionMatrix()
        render(progress.current)
      })
      resize.observe(element)
      update.current = render
      dispose = () => {
        active = false
        resize.disconnect()
        update.current = () => {}
        canvas.removeEventListener("webglcontextlost", contextLost)
        canvas.removeEventListener("webglcontextrestored", contextRestored)
        texture.dispose()
        geometries.forEach(geometry => geometry.dispose())
        frameMaterial.dispose()
        inkMaterial.dispose()
        imageMaterial.dispose()
        renderer.dispose()
        renderer.forceContextLoss()
        canvas.remove()
        delete element.dataset.webgl
      }
    }
    function reset() {
      dispose?.()
      dispose = undefined
      if (!media.matches) mount()
    }
    media.addEventListener("change", reset)
    mount()
    return () => { media.removeEventListener("change", reset); dispose?.() }
  }, [mode])

  return <div className={`scroll-portrait-scene scroll-portrait-scene-${mode}`} ref={host}>
    <div className="scroll-portrait-paper" aria-hidden="true"/>
    <Image className="scroll-portrait-fallback" src="/images/hero-manga-portrait.png" width={495} height={527} priority alt="Royce Mathew" sizes="(max-width: 760px) 65vw, 32vw" />
  </div>
})
