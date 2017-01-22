if (!GLSL) {var GLSL: {[path:string]:string} = {};}
GLSL["shader/gradient/fragment.glsl"] = "varying vec2 position;\nuniform vec4 colorIn, colorOut;\nvoid main() {\n    float kOut = min(length(position), 1.0);\n    gl_FragColor = colorOut * kOut + (1.0 - kOut) * colorIn;\n}";
