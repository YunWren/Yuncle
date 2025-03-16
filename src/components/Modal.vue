<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import useDOMCreate from '@/hooks/useDOMCreate'
defineProps({
  title: String,
  visible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['modal-on-close', 'modal-on-confirm'])
useDOMCreate('modal')
const onClose = () => {
  emit('modal-on-close') // 用于关闭事件
  console.log('关闭关闭')
}
const onConfirm = () => {
  emit('modal-on-confirm') // 用于确认事件
  console.log('确定')
}
</script>

<template>
<teleport to="#modal">
  <div class="modal d-block" tabindex="-1" v-if="visible">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{title}}</h5>
          <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close" @click="onClose">
          </button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal"  @click="onClose">取消</button>
          <button type="button" class="btn btn-primary"  @click="onConfirm">确定</button>
        </div>
      </div>
    </div>
  </div>
</teleport>
</template>
