<script lang="ts">

import { defineComponent, PropType, computed } from 'vue'
import { ColumnProps } from '../store'
import { addColumnAvatar } from '../helper'

export default defineComponent({
  name: 'ColumnList',
  props: {
    list: {
      type: Array as PropType<ColumnProps[]>,
      required: true
    }
  },
  setup (props) {
    const columnList = computed(() => {
      return props.list.map(column => {
        addColumnAvatar(column, 50, 50)
        return column
      })
    })
    return {
      columnList
    }
  }
})
</script>

<template>
    <div class="row">
        <div v-for="column in columnList" :key="column._id" class="col-4 mb-4">
            <div class="card h-100 shadow-sm">
              <div class="card-body text-center">
                <img :src="column.avatar && column.avatar.url" :alt="column.title" class="shadow-sm rounded-circle border border-light my-3">
                <h5 class="card-title">{{ column.title }}</h5>
                <p class="card-text" style="text-align: left;">{{ column.description }}</p>
                <router-link :to="`/column/${column._id}`" class="btn btn-outline-primary">进入专栏</router-link>
              </div>
            </div>
        </div>
      </div>
</template>
<style scoped>
.card-body img {
  width:60px;
  height:60px
}
</style>
