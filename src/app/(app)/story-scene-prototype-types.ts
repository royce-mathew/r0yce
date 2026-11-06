import type { PerspectiveCamera, Scene } from "three"

export type StoryVariant = "A" | "B" | "C"

export type StoryScene = {
  camera: PerspectiveCamera
  update: (progress: number, aspect: number) => void
}

export type StorySceneFactory = (scene: Scene) => StoryScene
