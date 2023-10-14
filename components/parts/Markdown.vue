<!-- eslint-disable vue/no-v-html -->
<template lang="pug">
.md(v-html="parsed")
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

<style scoped lang="scss">
.md :deep(ul) {
  list-style-type: disc;
  padding-left: 2rem;
}

.md :deep(ol) {
  list-style-type: decimal;
  padding-left: 1rem;
}
</style>