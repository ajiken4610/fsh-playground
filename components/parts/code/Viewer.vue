<template lang="pug">
.h-full
  canvas.h-full.w-full(ref="canvasElementRef")
</template>

<script setup lang="ts">
import { refDebounced } from "@vueuse/core";
import {
  Camera,
  Engine,
  FreeCamera,
  Logger,
  MeshBuilder,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
} from "babylonjs";
const props = defineProps<{ code: string }>();
const emit = defineEmits<(e: "log", value: string) => void>();
const code = toRef(props, "code");
const canvasElementRef = ref<HTMLCanvasElement>();
let outerEngine: Engine;

const createEngine = async (canvas: HTMLCanvasElement) => {
  let engine: Engine;
  // if (await WebGPUEngine.IsSupportedAsync) {
  //   engine = new WebGPUEngine(canvas);
  //   await (engine as WebGPUEngine).initAsync();
  // } else {
  engine = new Engine(canvas, false);
  // }
  window.addEventListener("resize", () => {
    engine.resize();
  });
  return engine;
};

const createShaderMaterial = async (
  fsh: string,
  scene: Scene,
  uniforms: string[],
) => {
  const ret = new ShaderMaterial(
    "shader-" + Math.random().toString(36).substring(2),
    scene,
    {
      vertexSource: `
precision highp float;
attribute vec3 position;
attribute vec2 uv;
varying vec2 vUV;
uniform mat4 worldViewProjection;


void main() {
    vec4 p = vec4(position, 1.);
    vUV = vec2(1.-uv.x,(.5-uv.y)*2.);
    gl_Position = worldViewProjection * p;
}`,
      fragmentSource: fsh,
    },
    {
      attributes: ["position", "normal", "uv"],
      uniforms: ["worldViewProjection"].concat(uniforms),
    },
  );
  return ret;
};

const updateLog = (reset?: boolean) => {
  emit("log", Logger.LogCache);
  reset && Logger.ClearLogCache();
};

let currentMaterial: ShaderMaterial;
onMounted(async () => {
  if (!canvasElementRef.value) {
    return;
  }
  const canvasElement = canvasElementRef.value;
  const engine = await createEngine(canvasElement);
  outerEngine = engine;
  const scene = new Scene(engine);
  scene.clearColor.r = 0;
  scene.clearColor.g = 0;
  scene.clearColor.b = 0;
  const camera = new FreeCamera("camera", new Vector3(0, 1, 0), scene);
  camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
  camera.orthoBottom = 0;
  camera.orthoTop = 0.5;
  camera.orthoLeft = -0.5;
  camera.orthoRight = 0.5;
  camera.setTarget(Vector3.Zero());
  var plane = MeshBuilder.CreateGround("plane", { height: 1, width: 1 }, scene);
  const updateUniforms = () => {
    if (currentMaterial) {
      currentMaterial.setVector2("resolution", new Vector2(canvasElement.width, canvasElement.height))
    }
  }
  watch(
    refDebounced(code, 2000),
    async (fsh) => {
      currentMaterial && currentMaterial.dispose();
      currentMaterial = await createShaderMaterial(fsh, scene, ["resolution"]);
      plane.material = currentMaterial;
      updateUniforms()
      setTimeout(() => {
        updateLog(true);
      }, 100);
    },
    { immediate: true },
  );
  engine.runRenderLoop(() => {
    scene.render();
  });
  const resizeObserver = new ResizeObserver(() => {
    updateUniforms()
  })
  resizeObserver.observe(canvasElement)

});

onUnmounted(() => {
  outerEngine.dispose();
});


</script>
