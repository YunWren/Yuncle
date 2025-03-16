<script setup lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css'
import ColumnList from '@/components/ColumnList.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
import { computed, onMounted } from 'vue'
import useLoadMore from '@/hooks/useLoadMore'
// import Uploader from '@/components/Uploader.vue'
// import createMessage from '@/components/createMessage'
const store = useStore<GlobalDataProps>()
const list = computed(() => store.getters.getColumns)
const total = computed(() => store.state.columns.total)
onMounted(() => {
  store.dispatch('fetchColumns', { page: 3 })
})
const { loadMorePage, isLastPage } = useLoadMore('fetchColumns', total, { pageSize: 3, currentPage: 2 })
</script>
<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <router-link :to="`/create`" class="btn btn-primary my-2">开始写文章</router-link>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <column-list :list="list"></column-list>
    <button
      class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25"
      style="display: block; margin-left: auto; margin-right: auto;"
       @click="loadMorePage" v-if="!isLastPage"
    >
      加载更多
    </button>
  </div>
</template>
