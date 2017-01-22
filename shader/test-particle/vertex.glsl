attribute vec2 attr_position;
attribute vec2 attr_velocity;
attribute float attr_size;
attribute float attr_startTime;

uniform vec2 G;
uniform float currentTime;

void main() {
    float t = currentTime - attr_startTime;
    gl_Position = vec4(attr_position + attr_velocity * t + G * t * t / 2.0, 0.0, 1.0);
    gl_PointSize = attr_size;
}