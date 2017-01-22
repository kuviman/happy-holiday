///<reference path="__package__.ts"/>

interface Number extends CV.Uniform {
}
interface vec2 extends CV.Uniform {
}
interface vec3 extends CV.Uniform {
}
interface vec4 extends CV.Uniform {
}

namespace CV {
    export interface Attribute extends PuttableInArray {
        CV_glType: AttributeType;
    }
    export type AttributeType = {sizeof: number, size: number, type: number};
    Number.prototype.CV_glType = {sizeof: Number.prototype.CV_sizeof, size: 1, type: gl.FLOAT};
    vec2.prototype.CV_glType = {sizeof: vec2.prototype.CV_sizeof, size: 2, type: gl.FLOAT};
    vec3.prototype.CV_glType = {sizeof: vec3.prototype.CV_sizeof, size: 3, type: gl.FLOAT};
    vec4.prototype.CV_glType = {sizeof: vec4.prototype.CV_sizeof, size: 4, type: gl.FLOAT};

    export interface Uniform extends PuttableInArray {
        CV_glType: AttributeType;
        CV_applyAsUniform(location: WebGLUniformLocation): void;
    }
    export type Uniforms = {[name: string]: Uniform};
    Number.prototype.CV_applyAsUniform = function (this: number, location: WebGLUniformLocation) {
        gl.uniform1f(location, this);
    };
    vec2.prototype.CV_applyAsUniform = function (this: vec2, location: WebGLUniformLocation) {
        gl.uniform2f(location, this.x, this.y);
    };
    vec3.prototype.CV_applyAsUniform = function (this: vec3, location: WebGLUniformLocation) {
        gl.uniform3f(location, this.x, this.y, this.z);
    };
    vec4.prototype.CV_applyAsUniform = function (this: vec4, location: WebGLUniformLocation) {
        gl.uniform4f(location, this.x, this.y, this.z, this.w);
    };

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
            result = gl.getAttribLocation(this.program, "attr_" + name);
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

        applyUniforms(uniforms: Uniforms) {
            this.use();
            for (let name in uniforms) {
                const uniform = uniforms[name];
                const location = this.uniformLocation(name);
                uniform.CV_applyAsUniform(location);
            }
        }

        bindAttribute(name: string, type: AttributeType, offset: number, stride: number) {
            let location = this.attribLocation(name);
            if (location == -1) {
                return;
            }
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, type.size, type.type, false, stride, offset);
        }
    }
}