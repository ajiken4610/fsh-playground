precision highp float;

varying vec2 vUV;

void main(){
  gl_FragColor = vec4(vUV,0.,1.);
}