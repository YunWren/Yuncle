<script setup lang="ts">
import { defineProps } from 'vue'
defineProps({
  disable: {
    type: Boolean,
    default: false
  }
})

</script>

<template>
    <li
    class="dropdown-option"
    :class="{'is-disable':disable}"
    >
        <slot></slot>
    </li>
</template>

<style>
.dropdown-option.is-disable * {
    color: darkgrey;
    pointer-events: none;
    background-color: transparent;
}
</style>
