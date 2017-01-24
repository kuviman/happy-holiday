attribute vec2 attr_position;
attribute float attr_size;
attribute vec3 attr_color;
attribute float attr_startTime;

varying vec3 color;

uniform float currentTime;
uniform float lifeTime;
uniform float blinkTime;

void main() {
    color = attr_color;
    float t = currentTime - attr_startTime;
    float blink = (0.5 - abs(min(min(t, lifeTime - t) / blinkTime, 1.0) - 0.5)) * 2.0;
    gl_PointSize = (1.0 + blink * 3.0) * attr_size * CV_canvasSize.y / 2.0;
    gl_Position = vec4(attr_position, 0.0, 1.0);
}