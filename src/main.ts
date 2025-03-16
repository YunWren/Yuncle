import { createApp } from 'vue'
import router from './router'
import axios from 'axios'
import store from './store'
import App from './App.vue'
import 'easymde/dist/easymde.min.css'
axios.defaults.baseURL = 'http://api.vikingship.xyz/api'
// axios.get('/columns').then(resp => {
//   console.log(resp.data)
// })
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  store.commit('setError', { status: false, message: '' })
  return config
})
axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
}, e => {
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(error)
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
