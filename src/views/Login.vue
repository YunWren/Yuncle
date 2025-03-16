<script setup lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ValidateInput, { RuleProp } from '@/components/ValidateInput.vue'
import ValidateForm from '@/components/ValidateForm.vue'
import { useStore } from 'vuex'
import createMessage from '@/components/createMessage'
type RulesProp = RuleProp[]

const router = useRouter()
const store = useStore()
const emailVal = ref('')
const emailRules: RulesProp = [
  { type: 'required', message: '该项输入不能为空' },
  { type: 'email', message: '请输入正确的电子邮箱格式' }
]
const passwordVal = ref('')
const passwordRules: RulesProp = [
  { type: 'required', message: '该项输入不能为空' },
  { type: 'password', message: '密码必须包含至少一个字母和一个数字，并且总长度不低于 6 位' }
]
const onFormSubmit = (result:boolean) => {
  if (result) {
    const payload = {
      email: emailVal.value,
      password: passwordVal.value
    }
    store.dispatch('loginAndFetch', payload).then(() => {
      createMessage('登录成功，两秒后跳转到首页...', 'success', 2000)
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }).catch(e => {
      console.log(e)
    })
  }
}
</script>
<template>
  <div class="login-page">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules" v-model="emailVal"
          placeholder="请输入邮箱地址"
          type="text"
          ref="inputRef"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          type="password"
          placeholder="请输入密码"
          :rules="passwordRules"
          v-model="passwordVal"
        />
      </div>
      <template v-slot:submit>
        <button type="submit" class="btn btn-primary btn-block btn-large">登录</button>
      </template>
    </validate-form>
  </div>
</template>
