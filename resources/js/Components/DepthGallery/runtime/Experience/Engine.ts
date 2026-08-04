// @ts-nocheck
import * as THREE from 'three'
import { Scroll } from './Scroll'

class Engine {
  constructor(canvas, experience, { host = null } = {}) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error('Engine requires a valid canvas element')
    }

    this.canvas = canvas
    this.host = host || canvas.parentElement || document.body
    this.experience = experience
    this.debug = this.experience.debug
    this.isInitialized = false
    this.isRunning = false
    this.isDisposed = false
    this.animationFrameRequestId = null
    this.preloadedTextures = new Map()
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    this.camera.position.set(0, 0, 6)

    this.scroll = new Scroll(
      this.camera,
      this.experience.gallery,
      this.debug,
      this.host
    )

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.autoClear = false

    this.onResize = () => this.resize()
    this.animate = this.update.bind(this)
  }

  async init() {
    if (this.isInitialized || this.isDisposed) return

    this.host.classList.add('depth-gallery--loading')

    try {
      this.preloadedTextures = await this.preloadTextures()
      if (this.isDisposed) return

      this.experience.gallery.setPreloadedTextures(this.preloadedTextures)
      await this.experience.init(this.scene, this.camera)
      if (this.isDisposed) return

      this.scroll.init()
      this.resize()
      window.addEventListener('resize', this.onResize)
      this.scroll.bindEvents()

      this.isInitialized = true
      this.start()
    } finally {
      this.host.classList.remove('depth-gallery--loading')
    }
  }

  start() {
    if (!this.isInitialized || this.isRunning || this.isDisposed) return
    this.isRunning = true
    this.update()
  }

  resize() {
    if (this.isDisposed) return

    const width = this.canvas.clientWidth || this.host.clientWidth || 1
    const height = this.canvas.clientHeight || this.host.clientHeight || 1
    if (width <= 0 || height <= 0) return

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, false)
    this.experience.gallery.updatePlaneScale()
    this.experience.gallery.layoutPlanes()
    this.experience.label.resize(width, height)
  }

  async preloadTextures() {
    const textureSources = this.experience.gallery.getTextureSources()
    if (!textureSources.length) return new Map()

    const textureLoader = new THREE.TextureLoader()
    const loadedTextures = new Map()

    await Promise.all(
      textureSources.map(async (textureSource) => {
        try {
          const texture = await textureLoader.loadAsync(textureSource)
          texture.colorSpace = THREE.SRGBColorSpace
          loadedTextures.set(textureSource, texture)
        } catch (error) {
          console.warn(`Texture failed to load: ${textureSource}`, error)
        }
      })
    )

    return loadedTextures
  }

  update() {
    if (!this.isRunning || this.isDisposed) return

    this.animationFrameRequestId = requestAnimationFrame(this.animate)
    const time = performance.now()

    this.scroll.update()
    this.experience.update(time, this.camera, this.scroll)

    this.renderer.clear(true, true, true)
    this.experience.background.render(this.renderer)
    this.renderer.clearDepth()
    this.renderer.render(this.scene, this.camera)
    this.experience.label.render()
  }

  dispose() {
    if (this.isDisposed) return

    this.isDisposed = true
    this.isRunning = false

    if (this.animationFrameRequestId !== null) {
      cancelAnimationFrame(this.animationFrameRequestId)
      this.animationFrameRequestId = null
    }

    window.removeEventListener('resize', this.onResize)
    this.scroll.dispose()
    this.experience.dispose?.()

    this.preloadedTextures.forEach((texture) => texture.dispose())
    this.preloadedTextures.clear()

    this.scene.clear()
    this.renderer.dispose()
    this.renderer.forceContextLoss?.()
    this.host.classList.remove('depth-gallery--loading')
  }
}

export { Engine }
