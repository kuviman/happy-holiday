attribute vec2 attr_position;
attribute float attr_size;
void main() {
    gl_Position = vec4(attr_position, 0.0, 1.0);
    gl_PointSize = attr_size;
}