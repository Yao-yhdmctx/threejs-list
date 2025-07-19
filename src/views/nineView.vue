<template>
  <div class="three-container" ref="container"></div>
  <div class="buttons">
    <button @click="playAnimationByName('RaiseBothHandsAndMouth')">播放动画（双手 + 嘴）</button>
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

let leftArmBone = null
let rightArmBone = null
let jawBone = null

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

  // ✅ 添加环境光 + 平行光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(100, 200, 100)
  scene.add(light)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  container.value.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)

  // ✅ 加载贴图
  const textureLoader = new THREE.TextureLoader()
  const bodyMap = textureLoader.load(
    '/fbx/indian-man-in-kurta/textures/AvatarBodyMale_Color_1K.jpeg'
  )

  // ✅ 加载 FBX
  const loader = new FBXLoader()
  loader.load('/fbx/indian-man-in-kurta/indian_man_in_kurta_1.fbx', (object) => {
    model = object
    model.scale.set(0.1, 0.1, 0.1)

    model.traverse((child) => {
      if (child.isMesh) {
        // ✅ 设置贴图材质
        child.material = new THREE.MeshStandardMaterial({ map: bodyMap })
        child.castShadow = true
        child.receiveShadow = true
      }

      if (child.isBone) {
        const name = child.name.toLowerCase()
        if (name.includes('upperarm_r')) rightArmBone = child
        if (name.includes('upperarm_l')) leftArmBone = child
        if (name.includes('jaw')) jawBone = child
      }
    })

    scene.add(model)
    mixer = new THREE.AnimationMixer(model)

    console.log('✅ 右臂:', rightArmBone?.name)
    console.log('✅ 左臂:', leftArmBone?.name)
    console.log('✅ 下巴:', jawBone?.name)
  })
}

function playAnimationByName(name) {
  if (!mixer || !model) return

  if (name === 'RaiseBothHandsAndMouth') {
    const clip = createRaiseBothHandsAndOpenMouth()
    if (clip) playClip(clip)
  }
}

function playClip(clip) {
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

function createRaiseBothHandsAndOpenMouth() {
  if (!leftArmBone || !rightArmBone || !jawBone) {
    console.warn('骨骼不完整，无法创建动画')
    return null
  }

  const times = [0, 1, 2]
  const handRot = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2))
  const handValues = [0, 0, 0, 1, handRot.x, handRot.y, handRot.z, handRot.w, 0, 0, 0, 1]

  const jawOpen = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 6, 0, 0))
  const jawValues = [0, 0, 0, 1, jawOpen.x, jawOpen.y, jawOpen.z, jawOpen.w, 0, 0, 0, 1]

  const tracks = [
    new THREE.QuaternionKeyframeTrack(`${leftArmBone.name}.quaternion`, times, handValues),
    new THREE.QuaternionKeyframeTrack(`${rightArmBone.name}.quaternion`, times, handValues),
    new THREE.QuaternionKeyframeTrack(`${jawBone.name}.quaternion`, times, jawValues)
  ]

  return new THREE.AnimationClip('RaiseBothHandsAndMouth', 2, tracks)
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
