<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Uploader from '@/components/Uploader.vue'
// import axios from 'axios'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '@/store'
import { beforeUploadCheck } from '@/helper'
import createMessage from '@/components/createMessage'
import EasyMDE, { Options } from 'easymde'
import Editor from '@/components/Editor.vue'
interface EditorInstance {
  clear:()=>void,
  getMDEInstance:()=> EasyMDE | null
}
const editorStatus = reactive({
  isValid: true,
  message: ''
})
const editorRef = ref < null | EditorInstance >()
const router = useRouter()
const store = useStore<GlobalDataProps>()
const titleVal = ref('')
let imageId = ''
const titleRules: RulesProp = [
  { type: 'required', message: '该项输入不能为空' }
]
const contentVal = ref('')
const contentRules: RulesProp = [
  { type: 'required', message: '该项输入不能为空' }
]
const handleFileUploaded = (rawData:ResponseType<ImageProps>) => {
  if (rawData.data._id) {
    imageId = rawData.data._id
  }
}
const uploadedData = ref()
const route = useRoute()
const isEditMode = !!route.query.id
const editorOptions:Options = {
  spellChecker: false
}
const checkEditor = () => {
  if (contentVal.value.trim() === '') {
    editorStatus.isValid = false
    editorStatus.message = '文章详情不能为空'
  } else {
    editorStatus.isValid = true
    editorStatus.message = ''
  }
}
// 转化为布尔类型
onMounted(() => {
  if (editorRef.value) {
    console.log(editorRef.value.getMDEInstance())
  }
  if (isEditMode) {
    store.dispatch('fetchPost', route.query.id).then((rawData: ResponseType<PostProps>) => {
      const currentPost = rawData.data
      if (currentPost.image) {
        uploadedData.value = { data: currentPost.image }
      }
      titleVal.value = currentPost.title
      contentVal.value = currentPost.content || ''
    })
  }
})
// console.log('3', titleVal.value, contentVal.value)
const onFormSubmit = (result: boolean) => {
  // 如果表单验证通过
  checkEditor()
  if (result && editorStatus.isValid) {
    // 从 Vuex 中获取当前用户的 columnId
    const { column, _id } = store.state.user

    // 如果 columnId 存在，表示用户有权限发布帖子
    if (column) {
      // 构建一个新的帖子对象
      const newPost: PostProps = {
        title: titleVal.value,
        content: contentVal.value,
        column,
        author: _id
      }
      if (imageId) {
        newPost.image = imageId
      }
      const actionName = isEditMode ? 'updatePost' : 'createPost'
      const sendData = isEditMode
        ? {
          id: route.query.id,
          payload: newPost
        }
        : newPost
      store.dispatch(actionName, sendData).then(() => {
        createMessage('发表成功, 2秒后跳转到文章', 'success', 2000)
        setTimeout(() => {
          router.push({ name: 'column', params: { id: column } })
        }, 2000)
      })
    }
  }
}
const uploadCheck = (file:File) => {
  const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
  const { passed, error } = result
  console.log(passed)

  // console.log(error)
  if (error === 'format') {
    createMessage('上传图片只能是 JPG/PNG 格式', 'error', 2000)
  }
  if (error === 'size') {
    createMessage('上传图片大小不能超过 1Mb', 'error', 2000)
  }
  return passed
}
</script>

<template>
  <div class="create-post-page">
    <h4>{{ isEditMode?'编辑文章': '新建文章'}}</h4>
    <uploader
    action="/upload"
    class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    :before-upload="uploadCheck"
    @file-uploaded="handleFileUploaded"
    :uploaded="uploadedData"
    >
    <h4>点击上传头图</h4>
    <template #loading>
      <div class="d-flex">
        <div class="spinner-border text-secondary" role="status">
          <!-- <span class="sr-only">Loading</span> -->
        </div>
        <span>&nbsp;&nbsp;&nbsp;</span>
        <h2>正在上传</h2>
      </div>
    </template>
    <template #uploaded="dataProps">
      <img :src="dataProps.uploadedData.data.url" alt="">
    </template>
  </uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label for="form-label">文章标题:</label>
        <validate-input
        :rules="titleRules"
        v-model="titleVal"
        placeholder="请输入文章标题"
        type="text"
        />
      </div>
      <div class="mb-3">
        <label for="form-label">文章详情:</label>
        <Editor v-model="contentVal"
        :options="editorOptions"
        ref="editorRef"
        @blur="checkEditor"
        :class="{'is-invalid':!editorStatus.isValid}"
        ></editor>
        <span v-if="!editorStatus.isValid" class="invalid-feedback mt-1">{{ editorStatus.message }}</span>
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">{{ isEditMode?'更新文章':'发表文章' }}</button>
      </template>
    </validate-form>
  </div>
</template>

<style>
.create-post-page .file-upload-container {
  height:200px;
  cursor:pointer;
}
.create-post-page .file-upload-container img {
  height:100%;
  width: 100%;
  object-fit: cover;
}
</style>
