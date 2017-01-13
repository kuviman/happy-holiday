///<reference path="__package__.ts"/>

namespace CV {
    function compileShader(type: number, source: string): WebGLShader {
        const shader: WebGLShader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader));
        }
        return shader;
    }

    export class Shader {
        private program: WebGLProgram;

        constructor(vertexSource: string, fragmentSource: string) {
            this.program = gl.createProgram();
            gl.attachShader(this.program, compileShader(gl.VERTEX_SHADER, vertexSource));
            gl.attachShader(this.program, compileShader(gl.FRAGMENT_SHADER,
                "precision mediump float;\n" + fragmentSource));
            gl.linkProgram(this.program);
            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
                throw new Error(gl.getProgramInfoLog(this.program));
            }
        }

        use(): void {
            gl.useProgram(this.program);
        }

        static load(url: string, callback: (shader: Shader) => void): Resource {
            let vertexSource: string;
            let fragmentSource: string;
            const vertexResource = loadText(url + "/vertex.glsl", (source) => vertexSource = source);
            const fragmentResource = loadText(url + "/fragment.glsl", (source) => fragmentSource = source);
            const shaderResource = new CombinedResource("Shader(" + url + ")", vertexResource, fragmentResource);
            shaderResource.onLoaded.subscribe(() => {
                callback(new Shader(vertexSource, fragmentSource));
            });
            return shaderResource;
        }

        private attributes: {[name: string]: number} = {};

        attribLocation(name: string): number {
            let result = this.attributes[name];
            if (result) {
                return result;
            }
            result = gl.getAttribLocation(this.program, name);
            this.attributes[name] = result;
            return result;
        }

        private uniforms: {[name: string]: WebGLUniformLocation} = {};

        uniformLocation(name: string): WebGLUniformLocation {
            let result = this.uniforms[name];
            if (result) {
                return result;
            }
            return this.uniforms[name] = gl.getUniformLocation(this.program, name);
        }
    }
}