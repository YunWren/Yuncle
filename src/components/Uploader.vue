<script lang="ts" setup>
import axios from 'axios'
import { ref, defineProps, PropType, defineEmits, defineOptions, watch } from 'vue'
import createMessage from './createMessage'

// 文件输入框的引用
const fileInput = ref<null | HTMLInputElement>(null)
// 上传状态类型
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
// 检查函数
type CheckFunction = (file:File)=>boolean
// 从父组件传入的接口地址
const props = defineProps({
  action: {
    type: String,
    required: true
  },
  beforeUpload: {
    type: Function as PropType<CheckFunction>
  },
  uploaded: {
    type: Object
  }
})
defineOptions({
  inheritAttrs: false
})
const emit = defineEmits(['file-uploaded', 'file-uploaded-error'])
// 初始上传状态
const fileStatus = ref<UploadStatus>(props.uploaded ? 'success' : 'ready')
const uploadedData = ref(props.uploaded)
watch(() => props.uploaded, (newValue) => {
  if (newValue) {
    fileStatus.value = 'success'
    uploadedData.value = newValue
  }
})
// 触发文件选择框
const triggerUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// 文件选择变化时触发的处理函数
const handleFileChange = (e: Event) => {
  const currentTarget = e.target as HTMLInputElement

  if (currentTarget.files) {
    const files = Array.from(currentTarget.files)
    if (props.beforeUpload) {
      const result = props.beforeUpload(files[0])
      if (!result) {
        return
      }
    }
    // 开始上传，设置为 loading 状态
    fileStatus.value = 'loading'
    const formData = new FormData()
    formData.append('file', files[0])

    // 发起上传请求
    axios.post(props.action, formData, {
      headers: {
        'Content-type': 'multipart/form-data'
      }
    })
      .then((resp) => {
      // 成功上传
        // console.log(resp)
        fileStatus.value = 'success'
        uploadedData.value = resp.data
        emit('file-uploaded', resp.data)
      })
      .catch((error) => {
      // 上传失败
        // console.error('上传失败', error)
        fileStatus.value = 'error'
        // console.log(error)

        emit('file-uploaded-error', { error })
      })
      .finally(() => {
      // 清空文件输入框
        if (fileInput.value) {
          fileInput.value.value = ''
        }
      })
    if (!uploadedData.value) {
      createMessage('服务器响应错误,请稍后再试', 'error', 2000)
    }
  }
}
</script>

<template>
  <div class="file-upload">
    <div class="file-upload-container" @click.prevent="triggerUpload" v-bind="$attrs">
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传...</button>
      </slot>
      <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>

    <!-- 隐藏的文件选择框 -->
    <input
      type="file"
      class="file-input d-none"
      ref="fileInput"
      @change="handleFileChange"
    >
  </div>
</template>
