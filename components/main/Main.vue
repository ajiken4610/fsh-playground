<template lang="pug">
.overflow-hidden
  NuxtPage(keepalive)
</template>

<script setup lang="ts">
const code = ref("");
provide("code", code);
</script>
