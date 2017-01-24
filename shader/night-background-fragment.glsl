uniform float time;

void main() {
    float kRed = snoise(1.2 * gl_FragCoord.xy / CV_canvasSize.y + vec2(1, 0.2) * time);
    float kGreen = snoise(0.7 * (gl_FragCoord.xy / CV_canvasSize.y + vec2(5, 1)) + vec2(-1, 0.4) * time);
    float kBlue = snoise(1.0 * (gl_FragCoord.xy / CV_canvasSize.y + vec2(3, 7)) + vec2(0.5, 0.7) * time);
    gl_FragColor = vec4(kRed * 0.03, kGreen * 0.03, kBlue * 0.1, 1.0);
}