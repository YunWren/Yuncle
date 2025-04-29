<script lang="ts">
import { PropType, defineProps } from 'vue'
import DropDownItem from '@/components/DropDownItem.vue'
import DropDown from '@/components/DropDown.vue'
import { UserProps, GlobalDataProps } from '@/store'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import createMessage from '@/components/createMessage'
</script>

<script setup lang="ts">
defineProps({
  user: {
    type: Object as PropType<UserProps>,
    required: true
  }
})
const router = useRouter()
const store = useStore<GlobalDataProps>()
const logout = () => {
  store.commit('logout')
  createMessage('登出成功, 两秒后跳转至首页...', 'success', 2000)
  setTimeout(() => {
    router.push('/')
  }, 2000)
}
</script>

<template>
    <nav class="navbar navbar-dark bg-info bg-gradient justify-content-between mb-4 px-4">
        <a href="/" class="navbar-brand fw-light fs-3">云圈</a>
        <ul v-if="!user.isLogin" class="list-inline mb-0">
            <li class="list-inline-item"><router-link :to="`/login`" class="btn btn-outline-light my-2">登录</router-link></li>
            <li class="list-inline-item"><router-link :to="`/Signup`" class="btn btn-outline-light my-2">注册</router-link></li>
        </ul>
        <ul v-else class="list-inline mb-0">
            <li class="list-inline-item">
                <drop-down :title="`你好 ${user.nickName}`">
                    <drop-down-item><router-link :to="`/create`" class="dropdown-item">新建文章</router-link></drop-down-item>
                    <drop-down-item><router-link :to="`/column/${user.column}`" class="dropdown-item">我的云层</router-link></drop-down-item>
                    <drop-down-item><a href="#" class="dropdown-item" >编辑资料</a></drop-down-item>
                    <drop-down-item><span class="dropdown-item" @click="logout">退出登录</span></drop-down-item>
                </drop-down>
        </li>
        </ul>
    </nav>
</template>

<style>
</style>
