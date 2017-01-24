///<reference path="__package__.ts"/>
///<reference path="../../shader/fullscreen-vertex.glsl.ts"/>

namespace CV {
    export class FullscreenShader {
        private shader: Shader;
        static buffer: WebGLBuffer;
        uniforms: Uniforms = {};

        static initialize() {
            this.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
        }

        constructor(fragmentSource: string) {
            this.shader = new Shader(GLSL["shader/fullscreen-vertex.glsl"], fragmentSource);
        }

        render() {
            gl.bindBuffer(gl.ARRAY_BUFFER, FullscreenShader.buffer);
            this.shader.bindAttribute("position", vec2.prototype.CV_glType, 0, vec2.prototype.CV_sizeof);
            this.shader.applyUniforms(this.uniforms);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        }
    }

    if (gl) {
        FullscreenShader.initialize();
    }
}