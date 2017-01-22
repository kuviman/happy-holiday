if (!GLSL) {var GLSL: {[path:string]:string} = {};}
GLSL["shader/gradient/vertex.glsl"] = "attribute vec2 attr_position;\nvarying vec2 position;\nvoid main() {\n    position = attr_position;\n    gl_Position = vec4(attr_position, 0.0, 1.0);\n}";
