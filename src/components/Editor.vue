<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, onUnmounted, defineExpose, reactive, watch } from 'vue'
import EasyMDE, { Options } from 'easymde'
import Message from './Message.vue'
interface EditorProps {
  modelValue?:string,
  options?:Options
}
interface EditorEvent {
  (type:'update:modelValue', value:string):void,
  (type:'change', value:string):void,
  (type:'blur'):void
}
// 组件初始化
const props = defineProps<EditorProps>()
const emit = defineEmits<EditorEvent>()
watch(() => props.modelValue, (newValue) => {
  if (easyMDEInstance) {
    if (newValue !== innerValue.value) {
      easyMDEInstance.value(newValue || '')
    }
  }
})
const textArea = ref<null|HTMLTextAreaElement>(null)
let easyMDEInstance: EasyMDE | null = null
const innerValue = ref(props.modelValue || '')
onMounted(() => {
  if (textArea.value) {
    // 组装 options
    const config:Options = {
      ...(props.options || {}),
      element: textArea.value,
      initialValue: innerValue.value
    }
    easyMDEInstance = new EasyMDE(config)
    // 监视行为
    easyMDEInstance.codemirror.on('change', () => {
      if (easyMDEInstance) {
        const updatedValue = easyMDEInstance.value()
        innerValue.value = updatedValue
        emit('update:modelValue', updatedValue)
        emit('change', updatedValue)
      }
    })
    easyMDEInstance.codemirror.on('blur', () => {
      if (easyMDEInstance) {
        emit('blur')
      }
    })
  }
})
const clear = () => {
  if (easyMDEInstance) {
    easyMDEInstance.value('')
  }
}
const getMDEInstance = () => {
  return easyMDEInstance
}
defineExpose({
  clear,
  getMDEInstance
})
// 销毁案例
onUnmounted(() => {
  if (easyMDEInstance) {
    easyMDEInstance.cleanup()
  }
  easyMDEInstance = null
})
</script>
<template>
  <div class="vue-easymde-editor">
    <textarea ref="textArea"></textarea>
  </div>
</template>
<style>
.vue-easymde-editor.is-invalid {
  border: 1px solid #dc3545;
}
</style>
