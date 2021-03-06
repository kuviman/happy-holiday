if (!GLSL) {var GLSL: {[path:string]:string} = {};}
GLSL["shader/fireworks/vertex.glsl"] = "attribute vec2 attr_from;\nattribute vec2 attr_to;\nattribute float attr_size;\nattribute vec3 attr_color;\nattribute float attr_startTime;\nattribute float attr_dist;\nattribute float attr_alpha;\n\nvarying vec4 color;\nvarying float decay;\n\nuniform float currentTime;\nuniform float lifeTime;\nuniform float decayTime;\n\nvoid main() {\n    color = vec4(attr_color, attr_alpha);\n    gl_PointSize = attr_size * CV_canvasSize.y / 2.0;\n    float t = (currentTime - attr_startTime) / lifeTime;\n    decay = 1.0 - min((lifeTime - currentTime + attr_startTime) / decayTime, 1.0);\n    float dist = attr_dist + length(attr_to - attr_from) * (1.0 - t);\n    float par = 0.03 * (1.0 - pow((t - attr_dist / length(attr_to - attr_from) - 0.5) * 2.0, 2.0));\n    gl_Position = vec4(attr_to + normalize(attr_from - attr_to) * dist + vec2(0.0, par), 0.0, 1.0);\n}";
