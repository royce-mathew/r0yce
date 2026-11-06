import * as THREE from "three"
import type { StorySceneFactory } from "./story-scene-prototype-types"

export const createDioramaScene: StorySceneFactory = (scene) => {
  const ivory = new THREE.MeshStandardMaterial({ color: "#f3efe3", roughness: 0.85 })
  const ink = new THREE.MeshStandardMaterial({ color: "#171714", roughness: 0.72 })
  const gold = new THREE.MeshStandardMaterial({ color: "#f0ce53", roughness: 0.55, metalness: 0.16 })
  const muted = new THREE.MeshStandardMaterial({ color: "#8c8a7d", roughness: 0.9 })
  const outline = new THREE.LineBasicMaterial({ color: "#11110f" })
  const rooms: THREE.Group[] = []
  const animated: { object: THREE.Object3D; room: number; y: number; phase: number; spin: number }[] = []
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 160)
  scene.add(new THREE.HemisphereLight("#fff8dd", "#48493e", 2.5))
  const key = new THREE.DirectionalLight("#fff6dc", 4)
  key.position.set(-4, 12, 7)
  scene.add(key)

  function solid(parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, z)
    const lines = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 28), outline)
    mesh.add(lines)
    parent.add(mesh)
    return mesh
  }

  function box(parent: THREE.Object3D, x: number, y: number, z: number, w: number, h: number, d: number, material: THREE.Material = ivory) {
    return solid(parent, new THREE.BoxGeometry(w, h, d), material, x, y, z)
  }

  function cylinder(parent: THREE.Object3D, x: number, y: number, z: number, radius: number, height: number, material: THREE.Material = ivory, sides = 16) {
    return solid(parent, new THREE.CylinderGeometry(radius, radius, height, sides), material, x, y, z)
  }

  function ring(parent: THREE.Object3D, x: number, y: number, z: number, radius: number, tube: number, material: THREE.Material = gold) {
    return solid(parent, new THREE.TorusGeometry(radius, tube, 6, 40), material, x, y, z)
  }

  function cable(parent: THREE.Object3D, points: THREE.Vector3[], material: THREE.Material, radius = 0.045) {
    return solid(parent, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 36, radius, 6, false), material, 0, 0, 0)
  }

  function float(object: THREE.Object3D, room: number, phase: number, spin = 0) {
    animated.push({ object, room, y: object.position.y, phase, spin })
  }

  function portal(parent: THREE.Object3D, x: number, z: number, width: number, height: number) {
    const arch = new THREE.Shape()
    arch.moveTo(-width / 2, 0)
    arch.lineTo(-width / 2, height - width / 2)
    arch.absarc(0, height - width / 2, width / 2, Math.PI, 0, true)
    arch.lineTo(width / 2, 0)
    arch.lineTo(width / 2 - 0.25, 0)
    arch.lineTo(width / 2 - 0.25, height - width / 2)
    arch.absarc(0, height - width / 2, width / 2 - 0.25, 0, Math.PI, false)
    arch.lineTo(-width / 2 + 0.25, 0)
    arch.closePath()
    return solid(parent, new THREE.ExtrudeGeometry(arch, { depth: 0.32, bevelEnabled: false, curveSegments: 24 }), ivory, x, 0.28, z)
  }

  for (let i = 0; i < 4; i++) {
    const room = new THREE.Group()
    room.position.x = i * 10
    rooms.push(room)
    scene.add(room)
    box(room, 0, -0.12, 0, 7.8, 0.38, 6.2)
    box(room, 0, -0.36, 0, 8, 0.12, 6.4, ink)
    for (let j = 0; j < 6; j++) box(room, -3 + j * 1.2, 0.079, 0, 0.018, 0.012, 6, muted)
    box(room, -2.65, 0.1, 2.7, 1.6, 0.035, 0.18, gold)
  }

  const game = rooms[0]
  box(game, -3.6, 1.35, -1.1, 0.2, 2.7, 3.7)
  box(game, -1.5, 0.35, 0.4, 2.2, 0.5, 2)
  box(game, 0.25, 0.85, -0.4, 1.6, 1.5, 1.5)
  box(game, 1.8, 1.5, -1.4, 1.6, 2.8, 1.5)
  const doorway = portal(game, 1.8, -1.5, 1.45, 3.8)
  doorway.position.y = 2.9
  const halo = ring(game, 1.8, 4.75, -1.32, 0.48, 0.055)
  float(halo, 0, 0.5, 0.25)
  const collectible = box(game, -1.6, 1.65, 0.4, 0.52, 0.52, 0.52, gold)
  collectible.rotation.z = Math.PI / 4
  float(collectible, 0, 0, 1)
  for (let i = 0; i < 3; i++) {
    const step = box(game, -0.5 + i * 0.68, 0.45 + i * 0.35, 1.8, 0.52, 0.18, 0.65)
    float(step, 0, i * 0.7)
  }
  const avatar = new THREE.Group()
  avatar.position.set(-2.4, 0.62, 1.4)
  game.add(avatar)
  box(avatar, 0, 0.6, 0, 0.5, 0.65, 0.35, ink)
  box(avatar, 0, 1.12, 0, 0.4, 0.4, 0.4)
  box(avatar, -0.17, 0.15, 0, 0.18, 0.4, 0.23, gold)
  box(avatar, 0.17, 0.15, 0, 0.18, 0.4, 0.23, gold)
  float(avatar, 0, 1.4)

  const cloud = rooms[1]
  for (let i = 0; i < 3; i++) {
    const rack = new THREE.Group()
    rack.position.set(-2.4 + i * 1.45, 0.1, -1.55)
    cloud.add(rack)
    box(rack, 0, 1.5, 0, 1.05, 3, 1, ink)
    for (let j = 0; j < 6; j++) {
      box(rack, 0, 0.35 + j * 0.43, 0.53, 0.88, 0.29, 0.09)
      box(rack, 0.28, 0.35 + j * 0.43, 0.59, 0.09, 0.09, 0.03, gold)
    }
  }
  const cloudCanopy = new THREE.Group()
  cloudCanopy.position.set(0.2, 4.4, -1.25)
  cloud.add(cloudCanopy)
  for (let i = 0; i < 5; i++) {
    solid(cloudCanopy, new THREE.SphereGeometry(0.62 + (i % 2) * 0.2, 12, 8), ivory, -1.5 + i * 0.72, Math.sin(i * 1.3) * 0.23, 0)
  }
  float(cloudCanopy, 1, 0.3)
  for (let i = 0; i < 3; i++) {
    const x = -2.3 + i * 2.25
    cylinder(cloud, x, 0.3, 1.55, 0.65, 0.45, ink)
    cylinder(cloud, x, 0.57, 1.55, 0.52, 0.1, gold)
    box(cloud, x, 1, 1.55, 0.65, 0.65, 0.18)
    cable(cloud, [new THREE.Vector3(x, 0.18, 1.55), new THREE.Vector3(x, 0.2, 0.4), new THREE.Vector3(-0.95, 0.2, -0.8)], gold)
    const packet = box(cloud, x, 0.7, 0.35, 0.15, 0.15, 0.15, gold)
    float(packet, 1, i * 1.4)
  }

  const finance = rooms[2]
  box(finance, 0, 1.8, -2.8, 7.3, 3.4, 0.16, ink)
  for (let i = 0; i < 9; i++) {
    const height = 0.5 + i * 0.22 + Math.sin(i * 1.8) * 0.3
    const bar = box(finance, -2.9 + i * 0.7, height / 2 + 0.3, -2.45, 0.34, height, 0.42, i > 5 ? gold : ivory)
    float(bar, 2, i * 0.45)
  }
  cable(finance, [new THREE.Vector3(-3, 1, -2.03), new THREE.Vector3(-1.8, 1.7, -2.03), new THREE.Vector3(-0.5, 1.35, -2.03), new THREE.Vector3(0.7, 2.45, -2.03), new THREE.Vector3(2.8, 3.2, -2.03)], gold, 0.065)
  box(finance, 0, 1.15, 0.4, 5.6, 0.2, 1.5)
  box(finance, -2.3, 0.6, 0.4, 0.2, 1.1, 1.25, ink)
  box(finance, 2.3, 0.6, 0.4, 0.2, 1.1, 1.25, ink)
  for (let i = 0; i < 3; i++) {
    const x = -1.8 + i * 1.8
    box(finance, x, 1.42, 0.5, 0.16, 0.4, 0.16, ink)
    box(finance, x, 1.93, 0.4, 1.35, 0.85, 0.12, ink)
    for (let j = 0; j < 3; j++) box(finance, x - 0.35, 1.72 + j * 0.18, 0.48, 0.45 + j * 0.2, 0.035, 0.02, j === 2 ? gold : ivory)
    box(finance, x, 1.28, 0.82, 0.9, 0.035, 0.28, muted)
  }
  cylinder(finance, 0.8, 0.52, 2, 0.48, 0.14, ink)
  cylinder(finance, 0.8, 0.27, 2, 0.07, 0.5, muted)
  box(finance, 0.8, 0.95, 2.3, 0.9, 0.85, 0.12, ink)

  const maker = rooms[3]
  box(maker, -0.7, 1.25, 0.55, 4.7, 0.26, 2)
  for (const x of [-2.7, 1.3]) for (const z of [-0.15, 1.2]) box(maker, x, 0.63, z, 0.18, 1.2, 0.18, ink)
  box(maker, -2.1, 1.65, 0.4, 1.1, 0.55, 0.7, ink)
  for (let i = 0; i < 4; i++) box(maker, -2.42 + i * 0.2, 1.65, 0.77, 0.08, 0.26, 0.04, gold)
  const sculpture = solid(maker, new THREE.IcosahedronGeometry(0.58, 0), gold, -0.45, 2.12, 0.5)
  float(sculpture, 3, 0.1, 1.1)
  ring(maker, -0.45, 2.12, 0.5, 0.86, 0.035, ink).rotation.y = 0.65
  box(maker, 0.85, 1.47, 0.6, 0.65, 0.15, 0.8, muted)
  portal(maker, 1.45, -1.7, 2.5, 4.5)
  const inner = ring(maker, 1.45, 3.3, -1.5, 0.72, 0.06)
  float(inner, 3, 1, 0.35)
  for (let i = 0; i < 4; i++) {
    const project = new THREE.Group()
    project.position.set(-1.9 + i * 0.95, 2.9 + i * 0.38, -1.8)
    project.rotation.z = -0.12 + i * 0.08
    maker.add(project)
    box(project, 0, 0, 0, 0.8, 0.65, 0.16, i === 3 ? gold : ivory)
    box(project, -0.15, 0.09, 0.1, 0.35, 0.06, 0.025, ink)
    box(project, -0.05, -0.1, 0.1, 0.55, 0.04, 0.025, ink)
    float(project, 3, i * 0.75, 0.12)
  }
  for (let i = 0; i < 3; i++) box(maker, -2.6, 0.2 + i * 0.18, 2.1, 1.05, 0.15, 0.7, i === 1 ? gold : ivory).rotation.y = i * 0.14

  let previousAspect = 0
  return {
    camera,
    update(progress, aspect) {
      const p = Math.max(0, Math.min(1, progress)) * 3
      const index = Math.min(2, Math.floor(p))
      const fraction = p - index
      const travel = fraction * fraction * (3 - 2 * fraction)
      const focus = (index + travel) * 10
      const mobile = aspect < 0.8
      const distance = mobile ? Math.max(1.58, 0.95 / aspect) : 1
      if (aspect !== previousAspect) {
        previousAspect = aspect
        camera.aspect = aspect
        camera.updateProjectionMatrix()
      }
      camera.position.set(focus + 8.5 * distance, 8.1 * distance, 12.8 * distance)
      camera.lookAt(focus, 1.8, 0)
      for (let i = 0; i < rooms.length; i++) {
        const proximity = Math.max(0, 1 - Math.abs(p - i))
        rooms[i].rotation.y = (p - i) * 0.13
        rooms[i].position.y = -0.65 * (1 - proximity)
      }
      for (let i = 0; i < animated.length; i++) {
        const item = animated[i]
        const local = p - item.room
        item.object.position.y = item.y + Math.sin(local * 2.8 + item.phase) * 0.16
        item.object.rotation.y = local * item.spin + Math.sin(local * 1.5 + item.phase) * 0.12
      }
    },
  }
}
