import * as THREE from "three"
import type { StorySceneFactory } from "./story-scene-prototype-types"

const INK = "#11110f"
const PAPER = "#f3efe3"
const GOLD = "#f0ce53"
const PAGE_WIDTH = 3.05
const PAGE_HEIGHT = 4.35
const SEGMENTS = 56

function pageTexture(chapter: number) {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 1440
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, 1024, 1440)
  const text = (value: string, x: number, y: number, size = 25, bold = false) => {
    ctx.fillStyle = INK
    ctx.font = `${bold ? "900" : "500"} ${size}px sans-serif`
    ctx.fillText(value, x, y)
  }
  const line = (x: number, y: number, xx: number, yy: number) => {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(xx, yy)
    ctx.stroke()
  }
  const panel = (x: number, y: number, w: number, h: number) => {
    ctx.strokeStyle = INK
    ctx.lineWidth = 5
    ctx.strokeRect(x, y, w, h)
  }
  const titles = ["WORLD / BUILDER", "SYSTEMS / AT SCALE", "SIGNAL / FROM DATA", "ALWAYS / CREATING"]
  text(`FIELD NOTES     /     CHAPTER 0${chapter + 1}`, 65, 75, 23, true)
  text(titles[chapter].split(" / ")[0], 65, 164, 74, true)
  text(titles[chapter].split(" / ")[1], 65, 244, 74, true)
  ctx.fillStyle = GOLD
  ctx.fillRect(65, 275, 888, 15)
  panel(65, 330, 888, 590)
  ctx.save()
  ctx.beginPath()
  ctx.rect(71, 336, 876, 578)
  ctx.clip()
  ctx.strokeStyle = INK
  ctx.lineWidth = 3
  if (chapter === 0) {
    text("PROJECT STAR", 97, 390, 35, true)
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 9; x++) {
        const px = 150 + x * 70 + y * 27
        const py = 540 + y * 40 - x * 10
        ctx.fillStyle = (x + y) % 4 === 0 ? GOLD : PAPER
        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(px + 64, py - 10)
        ctx.lineTo(px + 88, py + 25)
        ctx.lineTo(px + 24, py + 35)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      }
    }
    ctx.fillStyle = INK
    ctx.fillRect(440, 495, 100, 118)
    ctx.fillRect(420, 610, 140, 76)
    ctx.fillStyle = PAPER
    ctx.fillRect(459, 528, 17, 17)
    ctx.fillRect(505, 528, 17, 17)
    text("NPC", 470, 471, 25, true)
    text("ROBLOX GAME DEVELOPMENT", 97, 875, 27, true)
  } else if (chapter === 1) {
    text("CLOUD INFRASTRUCTURE", 97, 390, 33, true)
    for (let rack = 0; rack < 3; rack++) {
      const x = 160 + rack * 245
      panel(x, 475, 185, 275)
      for (let row = 0; row < 6; row++) {
        ctx.fillStyle = row === rack ? GOLD : INK
        ctx.fillRect(x + 15, 495 + row * 40, 155, 25)
        ctx.fillStyle = PAPER
        ctx.fillRect(x + 135, 502 + row * 40, 11, 10)
      }
      line(x + 92, 750, x + 92, 800)
      line(x + 92, 800, 510, 800)
    }
    ctx.fillStyle = GOLD
    ctx.fillRect(430, 773, 160, 65)
    text("RBC", 470, 817, 33, true)
    text("CONNECTED SYSTEMS", 97, 875, 27, true)
  } else if (chapter === 2) {
    text("PORTFOLIO ANALYTICS", 97, 390, 35, true)
    ctx.lineWidth = 1
    for (let y = 460; y < 810; y += 50) line(120, y, 900, y)
    for (let x = 120; x < 920; x += 65) line(x, 440, x, 810)
    for (let i = 0; i < 12; i++) {
      const h = 55 + ((i * 73) % 210)
      ctx.fillStyle = i % 3 === 0 ? GOLD : INK
      ctx.fillRect(145 + i * 61, 805 - h, 34, h)
    }
    ctx.lineWidth = 9
    ctx.beginPath()
    for (let i = 0; i < 12; i++) {
      const x = 162 + i * 61
      const y = 670 - i * 12 + Math.sin(i * 1.8) * 65
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    text("TD ASSET MANAGEMENT", 97, 875, 27, true)
  } else {
    text("THE NEXT EXPERIMENT", 97, 390, 35, true)
    for (let i = 0; i < 3; i++) {
      const x = 125 + i * 145
      const y = 470 + i * 90
      ctx.fillStyle = PAPER
      ctx.fillRect(x, y, 475, 240)
      panel(x, y, 475, 240)
      ctx.fillStyle = i === 2 ? GOLD : INK
      ctx.fillRect(x, y, 475, 35)
      for (let row = 0; row < 5; row++) {
        ctx.fillStyle = row % 3 === 0 ? GOLD : INK
        ctx.fillRect(x + 28 + (row % 2) * 28, y + 65 + row * 29, 110 + ((row * 53) % 210), 10)
      }
    }
  }
  ctx.restore()
  panel(65, 955, 425, 290)
  panel(520, 955, 433, 290)
  const labels = [
    ["INVENTORY", "NPC + UI", "GAME SYSTEMS", "WORLD LOGIC"],
    ["50+", "15,000+", "DEVELOPERS", "DEVICES"],
    ["TRADE", "DATA", "MONITORING", "MIGRATIONS"],
    ["OPEN SOURCE", "WEB / GAME", "EXPERIMENTS", "+ AI"],
  ][chapter]
  text(labels[0], 90, 1020, chapter === 1 ? 67 : 33, true)
  text(labels[1], 545, 1020, chapter === 1 ? 60 : 33, true)
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i === chapter ? GOLD : INK
    ctx.fillRect(95 + i * 87, 1060, 60, 60)
    ctx.strokeStyle = INK
    ctx.lineWidth = 3
    ctx.strokeRect(95 + i * 87, 1060, 60, 60)
    line(550, 1070 + i * 24, 915 - (i % 2) * 70, 1070 + i * 24)
  }
  text(labels[2], 90, 1204, 23, true)
  text(labels[3], 545, 1204, 23, true)
  text("BUILD. LEARN. TURN THE PAGE.", 65, 1322, 28, true)
  text(`ROYCE     /     ${String(chapter + 1).padStart(2, "0")}`, 65, 1380, 23)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

export const createVolumeScene: StorySceneFactory = (scene) => {
  const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 80)
  const volume = new THREE.Group()
  volume.rotation.z = -0.14
  scene.add(volume)
  const paper = new THREE.MeshStandardMaterial({ color: PAPER, roughness: 0.9 })
  const ink = new THREE.MeshStandardMaterial({ color: INK, roughness: 0.85 })
  const gold = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.55, metalness: 0.18 })
  const box = (w: number, h: number, d: number, x: number, y: number, z: number, material: THREE.Material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
    mesh.position.set(x, y, z)
    volume.add(mesh)
    return mesh
  }
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 5.4), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5, depthWrite: false }))
  shadow.position.set(0.22, -0.2, -0.43)
  volume.add(shadow)
  box(6.55, 4.65, 0.13, 0, 0, -0.29, ink)
  box(6.48, 4.58, 0.045, 0, 0, -0.2, gold)
  box(3.08, 4.38, 0.22, -1.56, 0, -0.055, paper)
  box(3.08, 4.38, 0.22, 1.56, 0, -0.055, paper)
  box(0.14, 4.65, 0.33, 0, 0, -0.08, gold)
  for (let edge = 0; edge < 9; edge++) {
    const material = edge % 3 === 0 ? gold : ink
    box(3.04, 0.012, 0.007, 1.56, -2.197, -0.15 + edge * 0.024, material)
    box(3.04, 0.012, 0.007, -1.56, -2.197, -0.15 + edge * 0.024, material)
  }
  for (let tab = 0; tab < 4; tab++) box(0.22, 0.35, 0.025, 3.17, 1.52 - tab * 0.92, 0.02 + tab * 0.012, gold)
  const leftArt = new THREE.Mesh(new THREE.PlaneGeometry(2.91, 4.2), new THREE.MeshBasicMaterial({ map: pageTexture(3), color: 0xbcb8ab }))
  leftArt.position.set(-1.57, 0, 0.068)
  volume.add(leftArt)
  const sheets: { position: THREE.BufferAttribute; normal: THREE.BufferAttribute }[] = []
  for (let page = 0; page < 4; page++) {
    const geometry = new THREE.PlaneGeometry(PAGE_WIDTH, PAGE_HEIGHT, SEGMENTS, 1)
    geometry.translate(PAGE_WIDTH / 2, 0, 0)
    const front = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: pageTexture(page), side: THREE.FrontSide }))
    const back = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: PAPER, side: THREE.BackSide, roughness: 0.95 }))
    front.position.z = 0.10 + (3 - page) * 0.018
    back.position.z = front.position.z
    front.frustumCulled = false
    back.frustumCulled = false
    volume.add(front, back)
    sheets.push({ position: geometry.getAttribute("position") as THREE.BufferAttribute, normal: geometry.getAttribute("normal") as THREE.BufferAttribute })
  }
  scene.add(new THREE.HemisphereLight(0xfffae8, 0x65615a, 2.4))
  const light = new THREE.DirectionalLight(0xffffff, 3.2)
  light.position.set(-4, 7, 10)
  scene.add(light)
  let previousAspect = 0
  return {
    camera,
    update(progress, aspect) {
      const p = THREE.MathUtils.clamp(progress, 0, 1)
      if (aspect !== previousAspect) {
        camera.aspect = aspect
        camera.updateProjectionMatrix()
        previousAspect = aspect
      }
      for (let page = 0; page < sheets.length; page++) {
        const sheet = sheets[page]
        const raw = page === 3
          ? THREE.MathUtils.clamp((p - 0.78) / 0.22, 0, 1) * 0.2
          : THREE.MathUtils.clamp((p * 4 - page - 0.12) / 0.85, 0, 1)
        const turn = raw * raw * (3 - 2 * raw)
        const bend = Math.sin(turn * Math.PI) * 1.05
        let x = 0
        let z = 0
        for (let col = 0; col <= SEGMENTS; col++) {
          const u = col / SEGMENTS
          if (col > 0) {
            const middleAngle = turn * Math.PI + bend * ((col - 0.5) / SEGMENTS - 0.35)
            x += Math.cos(middleAngle) * PAGE_WIDTH / SEGMENTS
            z += Math.sin(middleAngle) * PAGE_WIDTH / SEGMENTS
          }
          const angle = turn * Math.PI + bend * (u - 0.35)
          for (let row = 0; row < 2; row++) {
            const index = row * (SEGMENTS + 1) + col
            sheet.position.setXYZ(index, x, (0.5 - row) * PAGE_HEIGHT, z + Math.sin(turn * Math.PI) * 0.035 * u)
            sheet.normal.setXYZ(index, -Math.sin(angle), 0, Math.cos(angle))
          }
        }
        sheet.position.needsUpdate = true
        sheet.normal.needsUpdate = true
      }
      const mobile = aspect < 0.8
      const distance = mobile ? 14.2 / Math.max(aspect, 0.48) * 0.73 : 11.8
      const orbit = (p - 0.5) * 0.26
      camera.position.set(Math.sin(orbit) * 3.8, 2.4 + Math.sin(p * Math.PI) * 0.5, distance)
      camera.lookAt(0, 0, 0.25)
      volume.rotation.z = -0.14 + Math.sin(p * Math.PI) * 0.065
    },
  }
}
