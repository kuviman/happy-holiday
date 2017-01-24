if (!GLSL) {var GLSL: {[path:string]:string} = {};}
GLSL["shader/fireworks/fragment.glsl"] = "varying vec4 color;\nvarying float decay;\n\nvoid main() {\n    gl_FragColor = vec4(color.xyz, (1.0 - length(gl_PointCoord - vec2(0.5, 0.5)) / 0.5) * color.w * (1.0 - decay));\n}";
