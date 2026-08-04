// @ts-nocheck
import * as THREE from 'three'
import { Gallery } from './Gallery'
import { Background } from './Background/index'
import { Label } from './Label'
import { TrailController } from './TrailController'

class Experience {
  constructor({ host = null } = {}) {
    this.host = host || null
    this.isInitialized = false
    this.isDisposed = false
    this.frameDarkPlaneCount = 2
    this.isFrameTextDark = null
    this.debug = null
    this.gallery = new Gallery(this.debug, this.host)
    this.label = new Label(this.gallery, this.host)
    this.background = new Background(this.debug)
    this.trailController = new TrailController({
      gallery: this.gallery,
      debug: this.debug,
    })
  }

  async init(scene, camera) {
    if (this.isInitialized || this.isDisposed) return

    await this.gallery.init(scene)
    if (this.isDisposed) return

    this.label.init()
    this.background.init()
    this.trailController.init(scene, camera)

    const initialPlaneBlendData = this.gallery.getPlaneBlendData(camera.position.z)
    this.updateFrameTextTone(initialPlaneBlendData)

    this.isInitialized = true
  }

  updateFrameTextTone(planeBlendData) {
    if (!planeBlendData || !this.host) return

    const nearestPlaneIndex =
      planeBlendData.blend >= 0.5
        ? planeBlendData.nextPlaneIndex
        : planeBlendData.currentPlaneIndex
    const shouldUseDarkText = nearestPlaneIndex < this.frameDarkPlaneCount

    if (this.isFrameTextDark === shouldUseDarkText) return

    this.isFrameTextDark = shouldUseDarkText
    this.host.classList.toggle('depth-gallery--dark-text', shouldUseDarkText)
  }

  update(time, camera = null, scroll = null) {
    if (this.isDisposed) return

    this.trailController.update(camera, scroll, time)
    this.gallery.update(camera, scroll)
    this.label.update(camera)

    if (camera) {
      const planeBlendData = this.gallery.getPlaneBlendData(camera.position.z)
      this.updateFrameTextTone(planeBlendData)

      const moodBlendData = this.gallery.getMoodBlendData(camera.position.z)
      if (moodBlendData) {
        this.background.setMoodBlend(moodBlendData)
      }

      const depthProgress = this.gallery.getDepthProgress(camera.position.z)
      const velocityMax = scroll?.velocityMax || 1
      const velocityIntensity = THREE.MathUtils.clamp(
        Math.abs(scroll?.velocity || 0) / Math.max(velocityMax, 0.0001),
        0,
        1
      )
      const blend = planeBlendData?.blend ?? 0
      const distanceFromBlendCenter = Math.abs(blend - 0.5) * 2
      const transitionStability = THREE.MathUtils.smoothstep(
        distanceFromBlendCenter,
        0.35,
        1
      )
      const stabilizedVelocityIntensity = velocityIntensity * transitionStability

      this.background.setMotionResponse({
        depthProgress,
        velocityIntensity: stabilizedVelocityIntensity,
      })
    }

    this.background.update(time)
  }

  dispose() {
    if (this.isDisposed) return

    this.isDisposed = true
    this.trailController.dispose()
    this.gallery.dispose()
    this.label.dispose()
    this.background.dispose()
    this.host?.classList.remove('depth-gallery--dark-text')
    this.isInitialized = false
  }
}

export { Experience }
