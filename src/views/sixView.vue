<template>
    <div style="width: 500px;height: 500px;">
      <iframe id="myIframe" style="width: 100%;
    height: 100%;" src="https://www.zqfuture.com.cn/model/" frameborder="0"></iframe>
    <button @click="ifIpc">蹲下</button>
    <button @click="ifIpcs">走路</button>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
const list = ref([])

const imgurl = (name) => {
  // 直接引用 public 下的图片资源，不会被打包修改文件名
  if (import.meta.env.MODE === 'production') {
    return `./static/${name}`
  } else {
    return `/static/${name}`
  }
}
onMounted(()=>{
   // 接收 iframe 发来的消息
   window.addEventListener('message', (event) => {
      // 检查消息来源的安全性
      if (event.origin !== 'https://www.zqfuture.com.cn/model/') { // 替换为 iframe 的实际域名
        console.warn('父页面打印来历不明:', event.origin);
        return;
      }
      
      console.log('Message from iframe:', event.data);
    });
})
const ifIpcs = ()=>{
  const iframe:any = document.getElementById('myIframe');

    // 向 iframe 发送消息
    iframe.contentWindow.postMessage({ message: '走路' }, 'https://www.zqfuture.com.cn/model/');
}
const ifIpc = ()=>{
  const iframe:any = document.getElementById('myIframe');

    // 向 iframe 发送消息
    iframe.contentWindow.postMessage({ message: '蹲下' }, 'https://www.zqfuture.com.cn/model/');

   
}
</script>

<style lang="scss" scoped>

</style>