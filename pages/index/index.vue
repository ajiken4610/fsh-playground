<template lang="pug">
div(class="h-full")
  div(class="inline-block h-1/2 w-full overflow-y-auto px-1 md:h-full md:w-1/2")
    .square-outer(class="relative mx-auto w-[min(50vmin,100%)]")
      div(class="absolute left-0 top-0 h-full w-full")
        PartsCodeViewer(:code="code" @log="log")
    hr
    // eslint-disable-next-line
    div(v-html="logHTML" class="flex flex-col-reverse")
  div(class="inline-block h-1/2 w-full overflow-y-auto px-1 md:h-full md:w-1/2")
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
