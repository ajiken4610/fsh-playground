<template lang="pug">
div(class="h-full")
  div(class="inline-block h-1/2 w-full overflow-y-auto px-1 md:h-full md:w-1/2")
    PartsMarkdown(md="")
    .square-outer(class="relative mx-auto w-[min(90vmin,100%)]")
      div(class="absolute left-0 top-0 h-full w-full bg-gray-300")
  div(class="inline-block h-1/2 w-full overflow-y-auto px-1 md:h-full md:w-1/2")
    PartsCodeEditor(v-model="code")
</template>

<script setup lang="ts">
const code = inject<Ref<string>>("code")!;
setTimeout(() => {
  code.value = "uniform";
});
</script>

<style scoped lang="scss">
.square-outer:before {
  content: "";
  display: block;
  padding-top: 100%;
}
</style>
