varying vec4 color;
varying float decay;

void main() {
    gl_FragColor = vec4(color.xyz, (1.0 - length(gl_PointCoord - vec2(0.5, 0.5)) / 0.5) * color.w * (1.0 - decay));
}