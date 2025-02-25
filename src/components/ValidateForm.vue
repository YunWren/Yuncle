<script lang="ts">
import mitt from 'mitt'
import { defineEmits, onUnmounted } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
const emitter = mitt()
export { emitter }
</script>
<script setup lang="ts">
const emit = defineEmits(['form-submit'])
type ValidateFunc = () => boolean
let funcArr:ValidateFunc[] = []
const submitForm = () => {
  const result = funcArr.map(func => func()).every(result => result)
  // console.log('Validation result:', result)
  emit('form-submit', result)
}

const callback = (func?: ValidateFunc) => {
  if (func) {
    funcArr.push(func)
  }
}
emitter.on('form-item-created', callback)
// 关闭监听器
onUnmounted(() => {
  emitter.off('form-item-created', callback)
  funcArr = []
})
</script>

<template>
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary"> 提交 </button>
        <br>
      </slot>
    </div>
  </form>
</template>
