uniform float decayMoment;
uniform float decayTime;

varying vec3 color;
varying float lifeTime;

void main() {
    float k = 1.0 - min(length(gl_PointCoord.xy - vec2(0.5, 0.5)) * 2.0, 1.0);
    gl_FragColor = vec4(color * max(0.0, min(1.0, decayMoment - lifeTime / decayTime)), pow(k, 2.0));
}