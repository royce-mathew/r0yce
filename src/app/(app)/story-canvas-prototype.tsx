"use client"

import { useLayoutEffect, useRef } from "react"
import * as THREE from "three"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { createDioramaScene } from "./story-diorama-prototype"
import { createTunnelScene } from "./story-tunnel-prototype"
import { createVolumeScene } from "./story-volume-prototype"
import type { StoryVariant } from "./story-scene-prototype-types"

const factories = { A: createDioramaScene, B: createTunnelScene, C: createVolumeScene }

export function StoryCanvasPrototype({ variant }: { variant: StoryVariant }) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const host = root.current!
    const section = host.closest<HTMLElement>(".story-prototype")!
    const track = section.querySelector<HTMLElement>(".story-chapters")!
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" }, context => {
      let renderer: THREE.WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
      } catch {
        host.dataset.renderer = "unavailable"
        return
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.setClearColor(0x11110f)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.domElement.setAttribute("aria-hidden", "true")
      host.appendChild(renderer.domElement)
      host.dataset.renderer = context.conditions?.reduced ? "static" : "webgl"
      const scene = new THREE.Scene()
      const story = factories[variant](scene)
      let progress = context.conditions?.reduced ? .42 : 0
      let frame = 0
      let draws = 0
      const render = () => {
        frame = 0
        const width = host.clientWidth
        const height = host.clientHeight
        if (!width || !height) return
        story.update(progress, width / height)
        renderer.render(scene, story.camera)
        host.dataset.progress = progress.toFixed(3)
        host.dataset.draws = String(++draws)
        host.dataset.triangles = String(renderer.info.render.triangles)
        const chapter = Math.min(3, Math.floor(progress * 4))
        section.dataset.chapter = String(chapter)
        const marker = section.querySelector<HTMLElement>(".story-current")
        if (marker) marker.textContent = `${String(chapter + 1).padStart(2, "0")} / 04`
      }
      const invalidate = () => { if (!frame) frame = requestAnimationFrame(render) }
      const resize = new ResizeObserver(() => {
        renderer.setSize(host.clientWidth, host.clientHeight, false)
        invalidate()
      })
      resize.observe(host)
      renderer.setSize(host.clientWidth, host.clientHeight, false)
      if (!context.conditions?.reduced) {
        ScrollTrigger.create({
          trigger: track,
          start: "top 90px",
          end: "bottom bottom",
          onUpdate: self => { progress = self.progress; invalidate() },
          onRefresh: self => { progress = self.progress; invalidate() },
        })
      }
      invalidate()
      return () => {
        resize.disconnect()
        cancelAnimationFrame(frame)
        const geometries = new Set<THREE.BufferGeometry>()
        const materials = new Set<THREE.Material>()
        const textures = new Set<THREE.Texture>()
        scene.traverse(object => {
          const mesh = object as THREE.Mesh
          if (mesh.geometry) geometries.add(mesh.geometry)
          if (mesh.material) {
            const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
            list.forEach(material => {
              materials.add(material)
              Object.values(material).forEach(value => { if (value instanceof THREE.Texture) textures.add(value) })
            })
          }
        })
        textures.forEach(texture => texture.dispose())
        materials.forEach(material => material.dispose())
        geometries.forEach(geometry => geometry.dispose())
        renderer.dispose()
        renderer.forceContextLoss()
        renderer.domElement.remove()
      }
    }, host)
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => { cancelAnimationFrame(refresh); media.revert() }
  }, [variant])

  return <div ref={root} className="story-canvas" data-renderer="loading"><span className="story-webgl-message">3D unavailable in this browser. The complete story is below.</span></div>
}
