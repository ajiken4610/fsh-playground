<template lang="pug">
.overflow-hidden(ref="editorParentRef")
  NuxtPage
</template>

<script setup lang="ts">
const code = ref("")
provide("code", code)
</script>