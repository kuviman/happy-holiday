if (!GLSL) {var GLSL: {[path:string]:string} = {};}
GLSL["shader/test-particle/fragment.glsl"] = "void main() {\n    gl_FragColor = vec4(gl_PointCoord.xy, 0.0, 1.0);\n}";
