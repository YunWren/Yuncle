<script setup lang="ts">
import { defineComponent, computed, watch } from 'vue'
import GlobalHeader from './components/GloballHeader.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useStore } from 'vuex'

import createMessage from './components/createMessage'
import Loader from './components/Loader.vue'
import { GlobalDataProps } from './store'
// import Home from './views/Home.vue'
// import Login from './views/Login.vue'
defineComponent({
  name: 'App',
  components: {
  }
})
const store = useStore<GlobalDataProps>()
const currentUser = computed(() => store.state.user)
const isLoading = computed(() => store.state.loading)
const error = computed(() => store.state.error)
watch(() => error.value.status, () => {
  // 如果全局出现新错误，立刻更新并且以悬浮窗回显
  const { status, message } = error.value
  if (status && message) { createMessage(message, 'error', 3000) }
  // 全局错误回显
})
</script>

<template>
  <div class="container">
   <global-header :user="currentUser"></global-header>
    <loader v-if="isLoading" text="🦜玩命加载中🦜"></loader>
    <!-- <message type="error" :message="error.message" v-if="error.status"></message> -->
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 云圈-找到你的热爱</Li>
          <li class="list-inline-item">投诉</Li>
          <li class="list-inline-item">文档</Li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<style>

</style>
