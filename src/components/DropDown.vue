
<script setup lang="ts">
import { defineProps, ref, watch } from 'vue'
import useClickOutside from '@/hooks/useClickOutside'
const dropdownRef = ref< null | HTMLElement >(null)
const isOpen = ref(false)
// const handler = (e:MouseEvent) => {
//   if (dropdownRef.value) {
//     if (!dropdownRef.value.contains(e.target as HTMLElement) && isOpen.value) {
//       isOpen.value = false
//     }
//   }
// }
const isClickOutside = useClickOutside(dropdownRef)
watch(isClickOutside, () => {
  if (isOpen.value && isClickOutside.value) {
    isOpen.value = false
  }
})
const toggleOpen = () => {
  isOpen.value = !isOpen.value
}
defineProps({
  title: {
    type: String,
    Required: true
  }
})
</script>
<template>
    <div class="dropdown" ref="dropdownRef">
    <a href="#" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleOpen">{{ title }} </a>
    <ul class="dropdown-menu menu" :style="{display:'block'}" v-if="isOpen">
      <slot></slot>
  </ul>
</div>
</template>
<style>
/* .menu {
  width: 100px;
  background: #000;
} */
</style>
