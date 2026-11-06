import * as THREE from "three"
import type { StorySceneFactory } from "./story-scene-prototype-types"

export const createTunnelScene: StorySceneFactory = (scene) => {
  const ivory = new THREE.MeshBasicMaterial({ color: "#f3efe3" })
  const gold = new THREE.MeshBasicMaterial({ color: "#f0ce53" })
  const ink = new THREE.MeshBasicMaterial({ color: "#11110f" })
  const grey = new THREE.MeshBasicMaterial({ color: "#48483f" })
  const side = new THREE.MeshBasicMaterial({ color: "#98968a" })
  const cube = new THREE.BoxGeometry(1, 1, 1)
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 150)
  const root = new THREE.Group()
  scene.add(root)

  const box = (parent: THREE.Object3D, x: number, y: number, z: number, w: number, h: number, d: number, material: THREE.Material | THREE.Material[] = ivory) => {
    const mesh = new THREE.Mesh(cube, material)
    mesh.position.set(x, y, z)
    mesh.scale.set(w, h, d)
    parent.add(mesh)
    return mesh
  }
  const frame = (parent: THREE.Object3D, width: number, height: number, material: THREE.Material, weight = 0.07) => {
    box(parent, -width / 2, 0, 0, weight, height, 0.12, material)
    box(parent, width / 2, 0, 0, weight, height, 0.12, material)
    box(parent, 0, height / 2, 0, width, weight, 0.12, material)
    box(parent, 0, -height / 2, 0, width, weight, 0.12, material)
  }
  const label = (parent: THREE.Object3D, title: string, detail: string, x: number, y: number, z: number, width: number) => {
    const canvas = document.createElement("canvas")
    canvas.width = 1024
    canvas.height = 256
    const context = canvas.getContext("2d")!
    context.fillStyle = "#f3efe3"
    context.fillRect(0, 0, 1024, 256)
    context.fillStyle = "#11110f"
    context.font = "900 80px sans-serif"
    context.fillText(title, 36, 114)
    context.font = "500 30px monospace"
    context.fillText(detail, 40, 184)
    context.fillRect(40, 218, 944, 5)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, width / 4), material)
    mesh.position.set(x, y, z)
    parent.add(mesh)
    return mesh
  }

  for (let i = 0; i < 21; i++) {
    const portal = new THREE.Group()
    portal.position.set(0, 0, 7 - i * 4.5)
    portal.rotation.z = (i % 2 ? 1 : -1) * (0.04 + (i % 3) * 0.035)
    frame(portal, 10.8, 8.2, i % 4 === 0 ? gold : grey, i % 4 === 0 ? 0.09 : 0.035)
    root.add(portal)
    for (let direction = -1; direction <= 1; direction += 2) {
      const slash = box(root, direction * 4.5, -2.8, 7 - i * 4.5, 0.035, 0.035, 2.4, gold)
      slash.rotation.y = direction * 0.18
    }
  }
  box(root, 0, -3.75, -36, 10.5, 0.12, 100, ink)
  box(root, -3.7, -3.65, -36, 0.045, 0.035, 100, gold)
  box(root, 3.7, -3.65, -36, 0.045, 0.035, 100, gold)

  const stations: THREE.Group[] = []
  const headers: THREE.Mesh[] = []
  const titles = ["BUILD WORLDS", "CONNECT SYSTEMS", "MAKE DATA LEGIBLE", "KEEP CREATING"]
  const details = ["ROBLOX / PROJECT STAR", "RBC / CLOUD SYSTEMS", "TD ASSET MANAGEMENT", "OPEN SOURCE / WEB / GAMES / AI"]
  for (let i = 0; i < 4; i++) {
    const station = new THREE.Group()
    station.position.z = -24 * i
    root.add(station)
    stations.push(station)
    const panel = new THREE.Group()
    panel.position.set(i % 2 ? 3.5 : -3.5, 1.5, 4.5)
    panel.rotation.set(0, i % 2 ? -0.28 : 0.28, i % 2 ? 0.1 : -0.1)
    frame(panel, 3.4, 5.6, ivory, 0.12)
    box(panel, 0, -1.8, -0.1, 3.25, 1.7, 0.12, grey)
    for (let j = 0; j < 7; j++) {
      const stroke = box(panel, -1.35 + j * 0.44, 0.5, 0, 0.025, 2.8 - (j % 3) * 0.4, 0.04, ivory)
      stroke.rotation.z = -0.4
    }
    station.add(panel)
    headers.push(label(station, titles[i], details[i], 0, 3.0, 0.8, 6.6))
    label(panel, `0${i + 1}`, "SCROLL TO ENTER", 0, -1.8, 0.08, 2.8)
  }

  const game = stations[0]
  const gate = new THREE.Group()
  gate.position.set(0, -0.2, -1)
  frame(gate, 3.2, 3.8, gold, 0.2)
  game.add(gate)
  const platforms: THREE.Mesh[] = []
  for (let i = 0; i < 5; i++) {
    platforms.push(box(game, (i % 2 ? 1 : -1) * (0.8 + i * 0.2), -2.1 + i * 0.35, 3 - i * 1.5, 1.5, 0.3, 1.3, [side, side, ivory, grey, ivory, grey]))
  }
  const avatar = new THREE.Group()
  avatar.position.set(0, -0.3, 1)
  box(avatar, 0, 0.8, 0, 0.65, 0.65, 0.65, ivory)
  box(avatar, 0, -0.02, 0, 0.95, 0.95, 0.5, gold)
  box(avatar, -0.3, -0.8, 0, 0.35, 0.65, 0.4, ivory)
  box(avatar, 0.3, -0.8, 0, 0.35, 0.65, 0.4, ivory)
  game.add(avatar)
  label(game, "INVENTORY / NPC / UI", "SYSTEMS THAT MAKE PLAY POSSIBLE", 0, -2.9, 3, 5.8)

  const cloud = stations[1]
  const servers = new THREE.Group()
  cloud.add(servers)
  for (let i = 0; i < 6; i++) {
    const x = (i % 2 ? 1 : -1) * 2.1
    const z = 2 - Math.floor(i / 2) * 2.5
    box(servers, x, -0.7, z, 1, 3.8, 1.4, [grey, side, ivory, grey, ink, grey])
    for (let row = 0; row < 7; row++) {
      box(servers, x, -2.1 + row * 0.46, z + 0.72, 0.76, 0.035, 0.03, ivory)
      box(servers, x + 0.27, -2.0 + row * 0.46, z + 0.74, 0.07, 0.07, 0.035, gold)
    }
  }
  const packets: THREE.Mesh[] = []
  for (let i = 0; i < 12; i++) {
    packets.push(box(cloud, (i % 3 - 1) * 0.65, 0, -i * 0.7, 0.16, 0.16, 0.65, gold))
  }
  label(cloud, "50+ DEVELOPERS", "15,000+ DEVICES / CONNECTED", 0, -2.9, 3, 5.8)

  const analytics = stations[2]
  const bars: THREE.Mesh[] = []
  const heights = [1.1, 2.0, 1.4, 3.2, 2.5, 4.0, 3.4]
  for (let i = 0; i < heights.length; i++) {
    const height = heights[i]
    bars.push(box(analytics, -2.7 + i * 0.9, -2.5 + height / 2, -(i % 3) * 0.7, 0.53, height, 0.65, i === 5 ? gold : [side, grey, ivory, grey, ivory, side]))
    box(analytics, -2.7 + i * 0.9, -2.6, -1.7, 0.025, 0.025, 5, grey)
  }
  for (let i = 0; i < 5; i++) box(analytics, 0, -2.5 + i, -2.2, 6.5, 0.025, 0.025, grey)
  const trend = new THREE.Group()
  for (let i = 0; i < heights.length - 1; i++) {
    const dy = heights[i + 1] - heights[i]
    const segment = box(trend, -2.25 + i * 0.9, -2.1 + (heights[i] + heights[i + 1]) / 2, 1, Math.sqrt(0.81 + dy * dy), 0.06, 0.06, gold)
    segment.rotation.z = Math.atan2(dy, 0.9)
  }
  analytics.add(trend)
  label(analytics, "PORTFOLIO ANALYTICS", "TRADES / MIGRATIONS / WEB TOOLING", 0, -3.0, 3.2, 6)

  const creative = stations[3]
  const projects: THREE.Group[] = []
  for (let i = 0; i < 5; i++) {
    const project = new THREE.Group()
    project.position.set(Math.sin(i * 1.7) * 2.2, Math.cos(i * 1.7) * 1.4 - 0.2, -i * 1.5)
    project.rotation.set(0.13 * (i - 2), 0.15 * (i - 2), (i % 2 ? -1 : 1) * 0.14)
    frame(project, 2.4, 1.9, i === 0 ? gold : ivory, 0.09)
    box(project, 0, 0, -0.1, 2.25, 1.75, 0.06, ink)
    label(project, ["WEB", "GAMES", "AI", "TOOLS", "OPEN SOURCE"][i], "IDEA → EXPERIMENT", 0, 0, 0.02, 2.1)
    creative.add(project)
    projects.push(project)
  }
  const nucleus = new THREE.Mesh(new THREE.IcosahedronGeometry(0.65, 0), gold)
  nucleus.position.set(0, -0.3, 2.3)
  creative.add(nucleus)
  label(creative, "NEVER STOP MAKING", "EXPERIMENT / SHARE / REPEAT", 0, -2.9, 3.3, 5.8)

  let previousAspect = -1
  return {
    camera,
    update(progress, aspect) {
      const p = THREE.MathUtils.clamp(progress, 0, 1)
      const travel = p * 3
      const narrow = aspect < 0.8
      if (aspect !== previousAspect) {
        camera.aspect = aspect
        camera.fov = narrow ? 83 : 58
        camera.updateProjectionMatrix()
        previousAspect = aspect
      }
      const sway = Math.sin(travel * Math.PI * 2)
      camera.position.set(sway * (narrow ? 0.18 : 0.65), 0.55 + Math.sin(travel * Math.PI) * 0.25, (narrow ? 15 : 12) - travel * 24)
      camera.lookAt(-sway * 0.2, -0.1, camera.position.z - 19)
      camera.rotation.z = Math.sin(travel * Math.PI) * 0.025
      for (let i = 0; i < stations.length; i++) {
        const local = THREE.MathUtils.clamp(travel - i, -1, 1)
        stations[i].rotation.y = local * 0.065
        headers[i].rotation.z = Math.sin(local * Math.PI / 2) * 0.045
      }
      avatar.rotation.y = p * Math.PI * 1.6
      avatar.position.y = -0.3 + Math.sin(p * Math.PI * 6) * 0.16
      gate.rotation.y = -0.12 + p * 0.25
      for (let i = 0; i < platforms.length; i++) platforms[i].rotation.y = Math.sin(p * Math.PI * 2 + i) * 0.12
      for (let i = 0; i < packets.length; i++) {
        packets[i].position.z = 4 - ((i * 0.83 + p * 18) % 10)
        packets[i].position.y = Math.sin(i + p * Math.PI * 4) * 0.45
      }
      for (let i = 0; i < bars.length; i++) {
        const reveal = THREE.MathUtils.smoothstep(travel, 1.25 + i * 0.045, 1.95 + i * 0.045)
        const height = heights[i] * (0.3 + 0.7 * reveal)
        bars[i].scale.y = height
        bars[i].position.y = -2.5 + height / 2
      }
      trend.position.z = -0.3 + THREE.MathUtils.smoothstep(travel, 1.4, 2.1) * 0.3
      for (let i = 0; i < projects.length; i++) {
        projects[i].rotation.y = 0.15 * (i - 2) + Math.sin(p * Math.PI * 2 + i) * 0.2
        projects[i].rotation.z = (i % 2 ? -1 : 1) * 0.14 + Math.sin(p * Math.PI + i) * 0.07
      }
      nucleus.rotation.set(p * 2.8, p * 4.2, p * 1.3)
    },
  }
}
