<script setup lang="ts">
import * as THREE from 'three'
import WebGL from 'three/examples/jsm/capabilities/WebGL.js'
import { onMounted, ref } from 'vue'
const oneDiv = ref<HTMLDivElement | null>(null)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(500, 500)
onMounted(() => {
  // 创建立方体
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
  camera.position.z = 5
  oneDiv.value?.appendChild(renderer.domElement)

  // 渲染
  const animate = () => {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
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
  <span>创建一个场景相机以及一个一直转动的几何体 还有兼容性判断</span>
  <div ref="oneDiv" class="oneDiv"></div>
</template>
<style>
.oneDiv {
  width: 500px;
  height: 500px;
}
</style>
