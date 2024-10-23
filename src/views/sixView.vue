<template>
    <div v-for="v of list " :key="v.id">
      <img  :src="imgurl(v.img)" alt="">
      <h2>{{ v.text }}</h2>
      <h2>{{ v.img }}</h2>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
const list = ref([])
onMounted(()=>{
  console.log(window.list,'kjsalfdkjfl');
  list.value = window.list
})
const imgurl = (name) => {
  // 直接引用 public 下的图片资源，不会被打包修改文件名
  if (import.meta.env.MODE === 'production') {
    return `./static/${name}`
  } else {
    return `/static/${name}`
  }
}
</script>

<style lang="scss" scoped>

</style>