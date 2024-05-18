<template>
  <el-container style="width: 100%; height: 100%">
    <el-aside width="200px" style="height: 100%">
      <el-menu
        router
        style="height: 100%"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="oneView"
        text-color="#fff"
      >
        <el-menu-item v-for="(val, index) of routeList" :key="index" :index="val.name">
          <el-icon><icon-menu /></el-icon>
          <span>{{ val.meta.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
const route = useRoute()
let routeList = route.matched[0].children
console.log(routeList)
</script>