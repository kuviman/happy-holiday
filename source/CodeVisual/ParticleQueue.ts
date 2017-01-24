///<reference path="__package__.ts"/>

namespace  CV {
    export class ParticleQueue<T extends Particle> {
        private particles: T[] = [];
        maxParticles: number = 512;
        uniforms: Uniforms = {};
        private buffer: WebGLBuffer;
        private data: ArrayBuffer;
        private sizeofT: number;
        private attributes: {[name: string]: {type: GLType, offset: number}} = {};

        constructor(public shader: Shader) {
            this.buffer = gl.createBuffer();
        }

        private head: number = 0;
        private tail: number = 0;

        get particleCount(): number {
            let result = this.tail - this.head;
            if (result < 0) {
                result = this.particles.length + result;
            }
            return result;
        }

        push(particle: T) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            if (this.particles.length != this.maxParticles + 1) {
                this.head = this.tail = 0;
                this.particles.length = this.maxParticles + 1;
                this.sizeofT = 0;
                for (let name in particle) {
                    if (particle.hasOwnProperty(name) && this.shader.attribLocation(name) != -1) {
                        let attribute = particle[name] as Attribute;
                        let type = attribute.CV_glType;
                        this.attributes[name] = {type: type, offset: this.sizeofT};
                        this.sizeofT += type.sizeof;
                    }
                }
                this.data = new ArrayBuffer(this.sizeofT);
                gl.bufferData(gl.ARRAY_BUFFER, this.particles.length * this.sizeofT, gl.DYNAMIC_DRAW);
            }
            for (let name in this.attributes) {
                let attribute = particle[name] as Attribute;
                attribute.CV_putInArray(this.data, this.attributes[name].offset);
            }
            gl.bufferSubData(gl.ARRAY_BUFFER, this.sizeofT * this.tail, this.data);
            this.particles[this.tail] = particle;
            this.tail = (this.tail + 1) % this.particles.length;
            if (this.tail == this.head) {
                this.head = (this.head + 1) % this.particles.length;
            }
        }

        peek(): T {
            return this.head == this.tail ? null : this.particles[this.head];
        }

        pop(): T {
            let result = this.peek();
            this.head = (this.head + 1) % this.particles.length;
            return result;
        }

        render() {
            if (this.head == this.tail) {
                return;
            }
            this.shader.applyUniforms(this.uniforms);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            for (let name in this.attributes) {
                let attribute = this.attributes[name];
                this.shader.bindAttribute(name, attribute.type, attribute.offset, this.sizeofT);
            }
            if (this.head < this.tail) {
                gl.drawArrays(gl.POINTS, this.head, this.tail - this.head);
            } else {
                gl.drawArrays(gl.POINTS, this.head, this.particles.length - this.head);
                if (this.tail != 0) {
                    gl.drawArrays(gl.POINTS, 0, this.tail);
                }
            }
        }
    }
}