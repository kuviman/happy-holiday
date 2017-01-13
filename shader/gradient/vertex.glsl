attribute vec2 attr_position;
varying vec2 position;
void main() {
    position = attr_position;
    gl_Position = vec4(attr_position, 0.0, 1.0);
}