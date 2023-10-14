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

$headings: "h1", "h2", "h3", "h4", "h5", "h6";

@for $headingIndex from 1 through 6 {
  .md :deep(h#{$headingIndex}) {
    font-size: (8 - $headingIndex) * 0.5rem;
  }
}
</style>
