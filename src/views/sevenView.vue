<template>
  <div class="three-container" ref="container"></div>
  <div class="buttons">
    <button v-for="anim in animations" :key="anim.name" @click="playAnimation(anim)">
      {{ anim.label }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
const container = ref(null)
let scene, camera, renderer, mixer, clock, controls, animationId
let model // 主模型引用
let currentAction // 当前动作
const animationsMap = new Map()

// ✅ 动画资源配置（路径 + 中文名）
const animations = [
  { name: 'Animation_Confident_Strut_withSkin.fbx', label: '自信行走' },
  { name: 'Animation_Counterstrike_withSkin.fbx', label: '反恐动作' },
  { name: 'Animation_FunnyDancing_03_withSkin.fbx', label: '搞笑舞蹈' },
  { name: 'Animation_happy_jump_m_withSkin.fbx', label: '开心跳跃' },
  { name: 'Animation_Kung_Fu_Punch_withSkin.fbx', label: '功夫出拳' },
  { name: 'Animation_Magic_Genie_withSkin.fbx', label: '魔法精灵' },
  { name: 'Animation_Pod_Baby_Groove_withSkin.fbx', label: '跳舞宝宝' },
  { name: 'Animation_RunFast_withSkin.fbx', label: '快速奔跑' },
  { name: 'Animation_Running_withSkin.fbx', label: '奔跑' },
  { name: 'Animation_Walking_withSkin.fbx', label: '普通行走' }
]

// ✅ 初始化 Three.js 场景
onMounted(() => {
  initThree()
  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  controls?.dispose()
  renderer?.dispose()
})

// ✅ 初始化 Three 场景与模型
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

  // ✅ 加载主模型
  const loader = new FBXLoader()
  loader.load('/fbx/Character_output.fbx', (object) => {
    model = object
    model.scale.set(0.1, 0.1, 0.1)
    scene.add(model)

    mixer = new THREE.AnimationMixer(model)

    // ✅ 默认加载第一个动画
    playAnimation(animations[0])
  })
}

// ✅ 播放动画函数
function playAnimation(anim) {
  if (!mixer || !model) return

  const loader = new FBXLoader()
  const path = `/fbx/${anim.name}`

  // 若已缓存动画 clip
  if (animationsMap.has(anim.name)) {
    fadeToAction(animationsMap.get(anim.name))
    return
  }

  loader.load(path, (animObject) => {
    const clip = animObject.animations[0]
    animationsMap.set(anim.name, clip)
    fadeToAction(clip)
  })
}

// ✅ 动作平滑过渡切换
function fadeToAction(newClip) {
  const newAction = mixer.clipAction(newClip)

  if (currentAction && currentAction !== newAction) {
    newAction.reset().play()
    newAction.enabled = true
    currentAction.crossFadeTo(newAction, 0.5, false)
  } else {
    newAction.reset().play()
  }

  currentAction = newAction
}

// ✅ 渲染循环
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
