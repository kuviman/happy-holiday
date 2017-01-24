attribute vec2 attr_position;

void main() {
    gl_Position = vec4(attr_position, 0.0, 1.0);
}