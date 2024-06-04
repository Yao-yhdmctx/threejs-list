<script setup lang="ts">
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { onMounted, ref } from 'vue'
const oneDiv = ref<HTMLDivElement | null>(null)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
camera.position.z = 10
const renderer = new THREE.WebGLRenderer()
renderer.setSize(500, 500)
onMounted(() => {
  // 引入模型
  const loader = new GLTFLoader()
  loader.load(
    'src/assets/sorceress/scene.gltf',
    (glft: any) => {
      scene.add(glft.scene)
      oneDiv.value?.appendChild(renderer.domElement)
    },
    (xhr: any) => {
      console.log(xhr, 'xhr')
    },
    (err: any) => {
      console.log(err, 'err')
    }
  )

  // 渲染
  const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
})
</script>

<template>
  <span>引入模型</span>
  <div ref="oneDiv" class="oneDiv"></div>
</template>
<style>
.oneDiv {
  width: 500px;
  height: 500px;
}
</style>
