<script setup lang="ts">
import { defineProps, onUnmounted } from 'vue'
defineProps({
  text: {
    type: String
  },
  background: {
    type: String
  }
})
const node = document.createElement('div')
node.id = 'back'
document.body.appendChild(node)
onUnmounted(() => {
  document.body.removeChild(node)
})
</script>
<template>
  <teleport to="#back">
  <div class="d-flex justify-content-center align-items-center h-100 loading-container"
      :style="{backgroundColor:background || ''}"
  >
    <div class="loading-content">
      <div class="spinner-grow" role="status">
      <span class="visually-hidden sr-only">{{ text || 'loading' }}</span>
    </div>
    <p v-if="text" class="fs-4 text-dark small">{{ text }}</p>
    </div>
  </div>
  </teleport>
</template>
<style>
.loading-container {
  background: rgba(255, 255, 255, .5);
  z-index: 100;
  position: fixed;
  width: 100%;
  height: 100%;
  top:0;
  left:0;
}
.loading-container {
  text-align: center;
}
</style>
