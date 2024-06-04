<script setup lang="ts">
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import fontJson from '@/assets/font/helvetiker_regular.typeface.json'
import { onMounted, ref } from 'vue'
const oneDiv = ref<HTMLDivElement | null>(null)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
camera.position.z = 100
const renderer = new THREE.WebGLRenderer()
renderer.setSize(500, 500)
onMounted(() => {
  // 创建文字几何体
  let loader = new FontLoader()
  let font = loader.parse(fontJson)
  const material = new THREE.MeshBasicMaterial({ color: 0xfaf4f4 })
  const textGeometry = new TextGeometry('cityName', {
    font: font,
    size: 10, //字体大小
    height: 0.1 //字体高度
  })
  const textMesh = new THREE.Mesh(textGeometry, material)
  textMesh.castShadow = true
  textMesh.position.y += 15
  textMesh.position.z -= 50
  textMesh.position.x = -29
  textMesh.position.y = -0.5
  scene.add(textMesh)
  oneDiv.value?.appendChild(renderer.domElement)

  // 渲染
  const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
})
</script>

<template>
  <span>添加文字</span>
  <div ref="oneDiv" class="oneDiv"></div>
</template>
<style>
.oneDiv {
  width: 500px;
  height: 500px;
}
</style>
