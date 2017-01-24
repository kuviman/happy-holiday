void main() {
    float kRed = snoise(1.2 * gl_FragCoord.xy / CV_canvasSize.y);
    float kGreen = snoise(0.7 * (gl_FragCoord.xy / CV_canvasSize.y + vec2(5, 1)));
    float kBlue = snoise(1.0 * (gl_FragCoord.xy / CV_canvasSize.y + vec2(3, 7)));
    gl_FragColor = vec4(kRed * 0.03, kGreen * 0.03, kBlue * 0.1, 1.0);
}