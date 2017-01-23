if (!GLSL) {var GLSL: {[path:string]:string} = {};}
GLSL["shader/test-particle/fragment.glsl"] = "uniform float decayMoment;\nuniform float decayTime;\n\nvarying vec3 color;\nvarying float lifeTime;\n\nvoid main() {\n    float k = 1.0 - min(length(gl_PointCoord.xy - vec2(0.5, 0.5)) * 2.0, 1.0);\n    float decay = max(0.0, min(1.0, 1.0 - (lifeTime - decayMoment) / decayTime));\n    gl_FragColor = vec4(color * decay, pow(k, 2.0) * decay);\n}";
