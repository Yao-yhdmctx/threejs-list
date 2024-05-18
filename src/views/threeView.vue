<script setup lang="ts">
import * as THREE from 'three'
import WebGL from 'three/examples/jsm/capabilities/WebGL.js'
import { onMounted, ref } from 'vue'
const oneDiv = ref<HTMLDivElement | null>(null)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
camera.position.set(0, 0, 100)
camera.lookAt(0, 0, 0)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(500, 500)
onMounted(() => {
  // 创建线
  const points = []
  points.push(new THREE.Vector3(-10, 0, 0))
  points.push(new THREE.Vector3(0, 10, 0))
  points.push(new THREE.Vector3(10, 0, 0))
  console.log(points, 'points')

  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
  const line = new THREE.Line(geometry, material)
  scene.add(line)
  oneDiv.value?.appendChild(renderer.domElement)

  // 渲染
  const animate = () => {
    line.rotation.x += 0.01
    line.rotation.y += 0.01
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  // WebGL兼容性判断
  console.log(WebGL.isWebGLAvailable())

  if (WebGL.isWebGLAvailable()) {
    animate()
  } else {
    const warning = WebGL.getWebGLErrorMessage()
    oneDiv.value?.appendChild(warning)
  }
})
</script>

<template>
  <span>创建一个三角线</span>
  <div ref="oneDiv" class="oneDiv"></div>
</template>
<style>
.oneDiv {
  width: 500px;
  height: 500px;
}
</style>
