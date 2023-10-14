<template lang="pug">
div(ref="editorParentRef" class="h-full")
  CodeEditor(v-model="codePrevented" :languages="[['glsl','GLSL: openGLShadingLanguage']]" height="100%" width="100%" :line-nums="true")
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits(["update:modelValue"]);
const code = useVModel(props, "modelValue", emit);
const codePrevented = ref("");
const editorParentRef = ref<HTMLDivElement>();
onMounted(() => {
  watch(code, () => {
    setTimeout(() => (codePrevented.value = code.value));
  });
  watch(codePrevented, () => {
    setTimeout(() => (code.value = codePrevented.value));
  });
  let codeElement: HTMLSourceElement | undefined | null =
    editorParentRef.value?.querySelector?.("pre > code.hljs");
  if (editorParentRef.value) {
    watch(
      codePrevented,
      () => {
        codeElement && delete codeElement.dataset["highlighted"];
      },
      { immediate: true },
    );
  }
});
</script>
