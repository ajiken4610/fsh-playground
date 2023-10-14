<template lang="pug">
div(class="h-full") {{ props.code }}
  canvas(class="h-full w-full")
</template>

<script setup lang="ts">
const props = defineProps<{ code: string }>()
</script>