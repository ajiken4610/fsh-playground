<template lang="pug">
.h-full
  .inline-block.w-full.overflow-y-auto.px-1(class="h-1/2 md:h-full md:w-1/2")
    .square-outer.relative.mx-auto(class="w-[min(50vmin,100%)]")
      .absolute.left-0.top-0.h-full.w-full
        PartsCodeViewer(:code="code", @log="log")
    .py-2
      hr
    // eslint-disable-next-line
    .flex.flex-col-reverse(v-html="logHTML")
  .inline-block.w-full.overflow-y-auto.px-1(class="h-1/2 md:h-full md:w-1/2")
    PartsCodeEditor(v-model="code")
</template>

<script setup lang="ts">
import defaultShader from "assets/shaders/default.fsh?raw";
const code = inject<Ref<string>>("code")!;

code.value = defaultShader;
const logHTML = ref("");

const log = (value: string) => {
  logHTML.value = value;
};
</script>

<style scoped lang="scss">
.square-outer:before {
  content: "";
  display: block;
  padding-top: 100%;
}
</style>
