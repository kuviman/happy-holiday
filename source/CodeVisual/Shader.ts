///<reference path="__package__.ts"/>

namespace CV {
    export type Attribute = number | vec2 | vec3 | vec4;
    export type Uniform = Attribute;
    export type Uniforms = {[name: string]: Uniform};
    export type AttributeType = {sizeof: number, size: number, type: number};
    export const FLOAT_ATTRIBUTE_TYPE: AttributeType = {sizeof: SIZEOF_FLOAT, size: 1, type: gl.FLOAT};
    export const VEC2_ATTRIBUTE_TYPE: AttributeType = {sizeof: SIZEOF_FLOAT * 2, size: 2, type: gl.FLOAT};
    export const VEC3_ATTRIBUTE_TYPE: AttributeType = {sizeof: SIZEOF_FLOAT * 3, size: 3, type: gl.FLOAT};
    export const VEC4_ATTRIBUTE_TYPE: AttributeType = {sizeof: SIZEOF_FLOAT * 4, size: 4, type: gl.FLOAT};

    export function getAttributeType(value: Attribute) {
        if (typeof value === "number") {
            return FLOAT_ATTRIBUTE_TYPE;
        } else if (value instanceof vec4) {
            return VEC4_ATTRIBUTE_TYPE;
        } else if (value instanceof vec3) {
            return VEC3_ATTRIBUTE_TYPE;
        } else if (value instanceof vec2) {
            return VEC2_ATTRIBUTE_TYPE;
        } else {
            throw new Error();
        }
    }

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
                if (uniform instanceof Number) {
                    gl.uniform1f(location, uniform);
                } else if (uniform instanceof vec4) {
                    gl.uniform4f(location, uniform.x, uniform.y, uniform.z, uniform.w);
                } else if (uniform instanceof vec3) {
                    gl.uniform3f(location, uniform.x, uniform.y, uniform.z);
                } else if (uniform instanceof vec2) {
                    gl.uniform2f(location, uniform.x, uniform.y);
                }
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