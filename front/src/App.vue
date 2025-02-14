<template>
  <div class="h-dvh w-dvw flex items-center justify-center">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
<style>
  @import "@/App.css"
</style>