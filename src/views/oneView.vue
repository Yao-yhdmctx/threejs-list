<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { onMounted, ref } from 'vue'
const oneDiv = ref<HTMLDivElement | null>(null)
const scene = new THREE.Scene() //创建场景对象Scene
// const controls = new OrbitControls(camera, renderer.domElement)
// const loader = new GLTFLoader()
onMounted(() => {
  console.log(OrbitControls, 'OrbitControls', GLTFLoader, 'GLTFLoader')

  init()
})
// 初始化
const init = () => {
  /**
   * 创建网格模型
   */
  let geometry = new THREE.BoxGeometry(100, 100, 100) //创建一个立方体几何对象Geometry
  let material = new THREE.MeshLambertMaterial({
    color: 0x0000ff
  }) //材质对象Material
  let mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh
  scene.add(mesh) //网格模型添加到场景中
  /**
   * 光源设置
   */
  //点光源
  let point = new THREE.PointLight(0xffffff)
  point.position.set(400, 200, 300) //点光源位置
  scene.add(point) //点光源添加到场景中
  //环境光
  let ambient = new THREE.AmbientLight(0x444444)
  scene.add(ambient)
  /**
   * 相机设置
   */
  let width = window.innerWidth //窗口宽度
  let height = window.innerHeight //窗口高度
  let k = width / height //窗口宽高比
  let s = 200 //三维场景显示范围控制系数，系数越大，显示的范围越大
  //创建相机对象
  let camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
  camera.position.set(200, 300, 200) //设置相机位置
  camera.lookAt(scene.position) //设置相机方向(指向的场景对象)
  /**
   * 创建渲染器对象
   */
  let renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height) //设置渲染区域尺寸
  renderer.setClearColor(0xb9d3ff, 1) //设置背景颜色
  //body元素中插入canvas对象
  oneDiv.value?.appendChild(renderer.domElement)
  //执行渲染操作   指定场景、相机作为参数
  renderer.render(scene, camera)
  setInterval(() => {
    renderer.render(scene, camera) //执行渲染操作
    mesh.rotateY(0.01) //每次绕y轴旋转0.01弧度
  }, 20)
}
</script>

<template>
  <div ref="oneDiv" class="oneDiv"></div>
</template>
