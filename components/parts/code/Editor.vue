<template lang="pug">
div(ref="editorParentRef")
  CodeEditor(v-model="code" :languages="[['glsl','GLSL: openGLShadingLanguage']]")
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits(["update:modelValue"]);
const code = useVModel(props, "modelValue", emit);
const editorParentRef = ref<HTMLDivElement>();
onMounted(() => {
  if (editorParentRef.value) {
    const codeElement: HTMLSourceElement =
      editorParentRef.value.querySelector("pre > code.hljs");
    watch(
      code,
      () => {
        nextTick(() => {
          delete codeElement.dataset["highlighted"];
        });
      },
      { immediate: true },
    );
  }
});
</script>
