if (!GLSL) {var GLSL: {[path:string]:string} = {};}
GLSL["shader/fullscreen-vertex.glsl"] = "attribute vec2 attr_position;\n\nvoid main() {\n    gl_Position = vec4(attr_position, 0.0, 1.0);\n}";
