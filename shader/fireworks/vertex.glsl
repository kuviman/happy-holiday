attribute vec2 attr_from;
attribute vec2 attr_to;
attribute float attr_size;
attribute vec3 attr_color;
attribute float attr_startTime;
attribute float attr_dist;
attribute float attr_alpha;

varying vec4 color;
varying float decay;

uniform float currentTime;
uniform float lifeTime;
uniform float decayTime;

void main() {
    color = vec4(attr_color, attr_alpha);
    gl_PointSize = attr_size * CV_canvasSize.y / 2.0;
    float t = (currentTime - attr_startTime) / lifeTime;
    decay = 1.0 - min((lifeTime - currentTime + attr_startTime) / decayTime, 1.0);
    float dist = attr_dist + length(attr_to - attr_from) * (1.0 - t);
    float par = 0.03 * (1.0 - pow((t - attr_dist / length(attr_to - attr_from) - 0.5) * 2.0, 2.0));
    gl_Position = vec4(attr_to + normalize(attr_from - attr_to) * dist + vec2(0.0, par), 0.0, 1.0);
}