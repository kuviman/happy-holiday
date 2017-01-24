if (!GLSL) {var GLSL: {[path:string]:string} = {};}
GLSL["shader/star/fragment.glsl"] = "varying vec3 color;\n\nvoid main() {\n    float k = pow((1.0 - abs(gl_PointCoord.x - 0.5) * 2.0) * (1.0 - abs(gl_PointCoord.y - 0.5) * 2.0), 16.0);\n    gl_FragColor = vec4(vec3(1.0, 1.0, 1.0) * k + color * (1.0 - k), k);\n}";
