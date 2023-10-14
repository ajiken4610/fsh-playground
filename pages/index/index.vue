<template lang="pug">
div(class="h-full")
  div(class="inline-block h-1/2 w-full overflow-y-auto px-1 md:h-full md:w-1/2")
    .square-outer(class="relative mx-auto w-[min(90vmin,100%)]")
      div(class="absolute left-0 top-0 h-full w-full")
        PartsCodeViewer(:code="code")
  div(class="inline-block h-1/2 w-full overflow-y-auto px-1 md:h-full md:w-1/2")
    PartsCodeEditor(v-model="code")
</template>

<script setup lang="ts">
import defaultShader from "assets/shaders/default.fsh?raw"
const code = inject<Ref<string>>("code")!;

code.value = defaultShader

</script>

<style scoped lang="scss">
.square-outer:before {
  content: "";
  display: block;
  padding-top: 100%;
}
</style>
