<!-- eslint-disable vue/no-v-html-->
<template lang="pug">
.border-2.rounded-2xl.p-2.h-full.font-mono.auto-width
  .h-full.overflow-y-hidden.relative.auto-width
    textarea.absolute.bg-transparent.top-0.bottom-0.right-0.left-0.text-transparent.resize-none.caret-black(
      ref="textareaRef",
      v-model="code",
      class="focus:outline-0"
    )

    pre.absolute.highlighted.pointer-events-none.block(
      ref="highlitedElementRef"
      :style="copyStyles",
      v-html="highlited"
    )
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits(["update:modelValue"]);
const code = useVModel(props, "modelValue", emit);
const highlited = computed(() => parseGLSLHighlited(code.value));
const textareaRef = ref<HTMLPreElement>();
const copyStyles = ref<{ [key: string]: string }>({});
const scrollX = ref("0px")
const scrollY = ref("0px");
const highlitedElementRef = ref<HTMLPreElement>()
const autoWidth = ref("10px")
onMounted(() => {
  const copyKeys = ["font"];
  const computedStyle = window.getComputedStyle(textareaRef.value!);
  for (const key of copyKeys) {
    copyStyles.value[key] = computedStyle.getPropertyValue(key);
  }
  if (!highlitedElementRef.value) { return }
  const observer = new ResizeObserver(() => {
    autoWidth.value = ((highlitedElementRef.value?.offsetWidth || 0) + 16) + "px"
  })
  observer.observe(highlitedElementRef.value)
  textareaRef.value!.addEventListener("scroll", () => {
    scrollX.value = -textareaRef.value!.scrollLeft + "px";
    scrollY.value = -textareaRef.value!.scrollTop + "px";
  });
  scrollX.value = -textareaRef.value!.scrollLeft + "px";
  scrollY.value = -textareaRef.value!.scrollTop + "px";
});
</script>

<style scoped lang="scss">
.highlighted {
  transform: translateY(v-bind(scrollY));
}

.auto-width {
  width: v-bind(autoWidth);
  min-width: 100%;
}
</style>
