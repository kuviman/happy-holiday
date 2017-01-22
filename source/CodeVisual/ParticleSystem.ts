///<reference path="__package__.ts"/>

namespace  CV {
    export class Particle {
        [name: string]: Attribute | any;
        position: vec2;
    }

    export class ParticleSystem<T extends Particle> {
        particles: T[] = [];
        uniforms: Uniforms = {};
        private buffer: WebGLBuffer;
        private data: ArrayBuffer;
        private sizeofT: number;
        private attributes: {[name: string]: {type: AttributeType, offset: number}} = {};

        constructor(public shader: Shader) {
            this.buffer = gl.createBuffer();
        }

        render() {
            if (this.particles.length == 0) {
                return;
            }
            this.shader.applyUniforms(this.uniforms);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            if (!this.data || this.sizeofT * this.particles.length > this.data.byteLength) {
                const particle = this.particles[0];
                this.sizeofT = 0;
                for (let name in particle) {
                    if (particle.hasOwnProperty(name) && this.shader.attribLocation(name) != -1) {
                        let attribute = particle[name] as Attribute;
                        let type = attribute.CV_glType;
                        this.attributes[name] = {type: type, offset: this.sizeofT};
                        this.sizeofT += type.sizeof;
                    }
                }
                this.data = new ArrayBuffer(Math.ceil(this.sizeofT * this.particles.length * 1.5));
            }
            for (let i = 0; i < this.particles.length; i++) {
                const particle = this.particles[i];
                for (let name in this.attributes) {
                    let attribute = particle[name] as Attribute;
                    attribute.CV_putInArray(this.data, this.sizeofT * i + this.attributes[name].offset);
                }
            }
            for (let name in this.attributes) {
                let attribute = this.attributes[name];
                this.shader.bindAttribute(name, attribute.type, attribute.offset, this.sizeofT);
            }
            gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.DYNAMIC_DRAW);
            gl.drawArrays(gl.POINTS, 0, this.particles.length);
        }
    }
}