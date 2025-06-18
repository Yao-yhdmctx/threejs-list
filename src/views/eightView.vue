<template>
  <div class="three-container" ref="container"></div>
  <div class="buttons">
    <button @click="playAnimationByName('mixamo.com')">播放动画 1 (mixamo.com)</button>
    <button @click="playAnimationByName('Take 001')">播放动画 2 (Take 001)</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const container = ref(null)
let scene, camera, renderer, mixer, clock, controls, animationId
let model
let currentAction

// 载入时缓存动画剪辑
let animationsClips = []

onMounted(() => {
  initThree()
  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  controls?.dispose()
  renderer?.dispose()
})

function initThree() {
  clock = new THREE.Clock()
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xeeeeee)

  camera = new THREE.PerspectiveCamera(
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 150, 300)

  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(0, 200, 100)
  scene.add(light)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  container.value.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)

  const loader = new FBXLoader()
  loader.load('/fbx/animationFbx/Samba Dancing.fbx', (object) => {
    model = object
    model.scale.set(0.1, 0.1, 0.1)
    scene.add(model)

    mixer = new THREE.AnimationMixer(model)

    animationsClips = object.animations

    console.log('动画数量:', animationsClips.length)
    console.log(
      '动画名称:',
      animationsClips.map((clip) => clip.name)
    )

    // 默认播放第一个动画
    if (animationsClips.length > 0) {
      playAnimationByName(animationsClips[0].name)
    }
  })
}

function playAnimationByName(name) {
  if (!mixer || !model || !animationsClips.length) return
  const clip = animationsClips.find((c) => c.name === name)
  if (!clip) return

  const newAction = mixer.clipAction(clip)

  if (currentAction && currentAction !== newAction) {
    newAction.reset().play()
    newAction.enabled = true
    currentAction.crossFadeTo(newAction, 0.5, false)
  } else {
    newAction.reset().play()
  }
  currentAction = newAction
}

function animate() {
  animationId = requestAnimationFrame(animate)
  const delta = clock.getDelta()
  mixer?.update(delta)
  renderer.render(scene, camera)
}
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 90vh;
  overflow: hidden;
}
.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  background: #f4f4f4;
}
button {
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
}
</style>
