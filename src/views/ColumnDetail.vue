<script setup lang="ts">
import { useRoute } from 'vue-router'
import { GlobalDataProps, ColumnProps } from '@/store'
import PostList from '@/components/PostList.vue'
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
const route = useRoute()
const store = useStore<GlobalDataProps>()
const currentId = route.params.id
onMounted(() => {
  store.dispatch('fetchColumns', currentId)
  store.dispatch('fetchPosts', currentId)
})
const column = computed(() => {
  const selectColumn = store.getters.getColumnById(currentId) as ColumnProps | undefined
  // if (selectColumn) {
  //   addColumnAvatar(selectColumn, 100, 100)
  // }
  return selectColumn
})
console.log(column)
const list = computed(() => store.getters.getPostsByCid(currentId))
</script>

<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar && column.avatar.fitUrl" :alt="column.title" class="rounded-circle border w-100">
      </div>
      <div class="col-9">
        <h4>{{ column.title }}</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
  </div>
</template>
