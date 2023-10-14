<template lang="pug">
div(class="h-full")
  canvas(ref="canvasElementRef" class="h-full w-full")
</template>

<script setup lang="ts">
import { refDebounced } from "@vueuse/core";
import {
  BaseTexture,
  Camera,
  Engine,
  FreeCamera,
  Logger,
  Matrix,
  MeshBuilder,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  Vector4,
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
  uniforms: {
    [key: string]:
    | { type: "float" | "vec2" | "vec3" | "vec4" | "mat"; value: number[] }
    | { type: "sampler"; texture: BaseTexture };
  },
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
      uniforms: ["worldViewProjection"].concat(...Object.keys(uniforms)),
    },
  );

  for (const uniformName of Object.keys(uniforms)) {
    const uniform = uniforms[uniformName]!
    switch (uniform.type) {
      case "float":
        ret.setFloat(uniformName, uniform?.value?.[0] || 0)
        break;
      case "vec2":
        ret.setVector2(uniformName, new Vector2(uniform?.value?.[0] || 0, uniform?.value?.[1] || 0))
        break;
      case "vec3":
        ret.setVector3(uniformName, new Vector3(uniform?.value?.[0] || 0, uniform?.value?.[1] || 0, uniform?.value?.[2] || 0))
        break;
      case "vec4":
        ret.setVector4(uniformName, new Vector4(uniform?.value?.[0] || 0, uniform?.value?.[1] || 0, uniform?.value?.[2] || 0, uniform?.value?.[3] || 0))
        break;
      case "mat":
        ret.setMatrix(uniformName, Matrix.FromArray(uniform.value || [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]))
        break;
      case "sampler":
        ret.setTexture(uniformName, uniform.texture!)
    }
  }
  return ret;
};

const updateLog = (reset?: boolean) => {
  emit("log", Logger.LogCache);
  reset && Logger.ClearLogCache();
}

let lastMaterial: ShaderMaterial;
onMounted(async () => {
  if (!canvasElementRef.value) {
    return;
  }
  const canvasElement = canvasElementRef.value;
  const engine = await createEngine(canvasElement);
  outerEngine = engine;
  const scene = new Scene(engine);
  scene.clearColor.r = 0
  scene.clearColor.g = 0;
  scene.clearColor.b = 0;
  const camera = new FreeCamera("camera", new Vector3(0, 1, 0), scene);
  camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
  camera.orthoBottom = 0;
  camera.orthoTop = .5;
  camera.orthoLeft = -.5;
  camera.orthoRight = .5;
  camera.setTarget(Vector3.Zero());
  var plane = MeshBuilder.CreateGround("plane", { height: 1, width: 1 }, scene);

  watch(
    refDebounced(code, 2000),
    async (fsh) => {
      lastMaterial && lastMaterial.dispose();
      lastMaterial = await createShaderMaterial(fsh, scene, {});
      plane.material = lastMaterial;
      setTimeout(() => {
        updateLog(true)
      }, 100)
    }, { immediate: true }
  );
  engine.runRenderLoop(() => {
    scene.render()
  });
});

onUnmounted(() => {
  outerEngine.dispose();
});
</script>
