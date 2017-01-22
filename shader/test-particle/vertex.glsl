attribute vec2 attr_position;
attribute vec2 attr_velocity;
attribute float attr_size;
attribute float attr_startTime;
attribute vec3 attr_color;

uniform vec2 G;
uniform float currentTime;

varying vec3 color;
varying float lifeTime;

void main() {
    color = attr_color;
    lifeTime = currentTime - attr_startTime;
    gl_Position = vec4(attr_position + attr_velocity * lifeTime + G * lifeTime * lifeTime / 2.0, 0.0, 1.0);
    gl_PointSize = attr_size;
}