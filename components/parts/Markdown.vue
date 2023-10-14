<!-- eslint-disable vue/no-v-html -->
<template lang="pug">
div(v-html="parsed")
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ md: string }>(), {
  md: "# MD_NOT_PROVIDED",
});
const parsed = ref("");
watchEffect(async () => {
  parsed.value = await parseMD(props.md);
});
</script>
