<template>
  <div class="overflow-auto h-dvh w-dvw flex items-start justify-center p-8">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
<style>
  @import "@/App.css"
</style>