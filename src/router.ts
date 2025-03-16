import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import ColumnDetail from '@/views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'
import Signup from './views/Signup.vue'
import PostDetail from '@/views/PostDetail.vue'
import store from '@/store'
import axios from 'axios'
import { createRouter, createWebHistory } from 'vue-router'
const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/create',
      name: 'CreatePost',
      component: CreatePost,
      meta: { requiredLogin: true }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: PostDetail
    },
    {
      path: '/create/:id',
      name: 'create',
      component: CreatePost, // 这个是目标组件
      props: true // 允许将 params 传递为组件的 prop
    }
  ],
  scrollBehavior () {
    // 返回一个符合标准的滚动位置
    return { top: 0 } // 这将滚动到页面的顶部
  }
})
router.beforeEach((to, from, next) => {
  const { user, token } = store.state
  const { requiredLogin, redirectAlreadyLogin } = to.meta
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        if (redirectAlreadyLogin) {
          next('/')
        } else {
          next()
        }
      }).catch(e => {
        console.error(e)
        store.commit('logout')
        next('login')
      })
    } else {
      if (requiredLogin) {
        next('/')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
