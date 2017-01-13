varying vec2 position;
uniform vec4 colorIn, colorOut;
void main() {
    float kOut = min(length(position), 1.0);
    gl_FragColor = colorOut * kOut + (1.0 - kOut) * colorIn;
}