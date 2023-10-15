import hljs from "highlight.js";
import "highlight.js/styles/github.css";
export default (code: string) => {
  return sanitizeHTML(hljs.highlight(code, { language: "glsl" }).value);
};
