import "highlight.js";
import CodeEditor from "simple-code-editor";
export default defineNuxtPlugin((app) => {
  app.vueApp.component("CodeEditor", CodeEditor);
});
