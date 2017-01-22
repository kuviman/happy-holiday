if (!GLSL) {var GLSL: {[path:string]:string} = {};}
GLSL["shader/test-particle/vertex.glsl"] = "attribute vec2 attr_position;\nattribute float attr_size;\nvoid main() {\n    gl_Position = vec4(attr_position, 0.0, 1.0);\n    gl_PointSize = attr_size;\n}";
