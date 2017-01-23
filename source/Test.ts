///<reference path="CodeVisual/__package__.ts"/>

///<reference path="../shader/gradient/vertex.glsl.ts"/>
///<reference path="../shader/gradient/fragment.glsl.ts"/>
///<reference path="../shader/test-particle/vertex.glsl.ts"/>
///<reference path="../shader/test-particle/fragment.glsl.ts"/>

// let gradientShader: CV.Shader;
// CV.Shader.load("shader/gradient", function (shader: CV.Shader) {
//     gradientShader = shader;
// });
const gradientShader: CV.Shader = new CV.Shader(GLSL["shader/gradient/vertex.glsl"], GLSL["shader/gradient/fragment.glsl"]);
const particleShader: CV.Shader = new CV.Shader(GLSL["shader/test-particle/vertex.glsl"], GLSL["shader/test-particle/fragment.glsl"]);
const buffer = CV.gl.createBuffer();
CV.gl.bindBuffer(CV.gl.ARRAY_BUFFER, buffer);
CV.gl.bufferData(CV.gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), CV.gl.STATIC_DRAW);

function random(a: number, b: number) {
    return a + Math.random() * (b - a);
}

class Particle extends CV.Particle {
    position: vec2 = vec2.rotate(new vec2(random(0, 0.1), 0), random(0, 2 * Math.PI));
    size: number = random(5, 50) * sizeSetting.value;
    velocity: vec2 = new vec2(random(-0.3, 0.3), random(0.5, 1.3));
    color: vec3 = new vec3(random(0.8, 1), random(0, 0.5), 0);

    //noinspection JSUnusedGlobalSymbols
    constructor(public startTime: number) {
        super();
    }
}

class P2 extends CV.Particle {
}

let sizeSetting = new CV.RangeSetting("Size", 0.01, 10, 0.01);
CV.loadSetting(sizeSetting, 1);
CV.settings.add(sizeSetting);

let densitySetting = new CV.RangeSetting("Density", 0.01, 10, 0.01);
CV.loadSetting(densitySetting, 1);
CV.settings.add(densitySetting);

let canvasSetting = new CV.RangeSetting("Canvas scaling", 1, 8);
CV.loadSetting(canvasSetting, CV.canvasScaling, (value) => CV.canvasScaling = value);
CV.settings.add(canvasSetting);

class Test implements CV.State {
    currentTime: number = 0;
    particleSystem: CV.ParticleQueue<Particle> = new CV.ParticleQueue<Particle>(particleShader);

    constructor() {
        this.particleSystem.uniforms["decayMoment"] = 0.3;
        this.particleSystem.uniforms["decayTime"] = 0.2;
        this.particleSystem.uniforms["lifeLength"] = this.lifeLength;
    }

    nextParticle: number = 0;
    G = new vec2(0, -0.5);
    lifeLength = 0.5;

    update(deltaTime: number): void {
        this.particleSystem.maxParticles = Math.round(8000 * densitySetting.value);
        this.currentTime += deltaTime;
        // for (let particle of this.particleSystem.particles) {
        //     particle.position = vec2.add(particle.position, vec2.mul(particle.velocity, deltaTime));
        //     particle.velocity = vec2.add(particle.velocity, vec2.mul(this.G, deltaTime));
        // }
        while (this.particleSystem.particleCount) {
            let p = this.particleSystem.peek();
            let t = this.currentTime - p.startTime;
            if (t > 0.5) {//p.position.y + p.velocity.y * t + this.G.y * t * t / 2 < 0) {
                this.particleSystem.pop();
            } else {
                break;
            }
        }
        this.nextParticle -= deltaTime;
        while (this.nextParticle < 0) {
            this.particleSystem.push(new Particle(this.currentTime));
            this.nextParticle += 5e-4 / densitySetting.value;
        }
        CV.stats.watch("particles", this.particleSystem.particleCount);
    }

    render(): void {
        CV.gl.clearColor(0, 0, 0, 1);
        CV.gl.clear(CV.gl.COLOR_BUFFER_BIT);
        gradientShader.use();
        CV.gl.bindBuffer(CV.gl.ARRAY_BUFFER, buffer);
        const loc: number = gradientShader.attribLocation("position");
        CV.gl.enableVertexAttribArray(loc);
        CV.gl.vertexAttribPointer(loc, 2, CV.gl.FLOAT, false, 8, 0);
        CV.gl.uniform4f(gradientShader.uniformLocation("colorOut"), 0, 0, 0, 1);
        const out = 0.05;
        CV.gl.uniform4f(gradientShader.uniformLocation("colorIn"), out, out, out, 1);
        CV.gl.drawArrays(CV.gl.TRIANGLE_FAN, 0, 4);

        this.particleSystem.uniforms["pixelHeight"] = CV.canvas.height;
        this.particleSystem.uniforms["G"] = this.G;
        this.particleSystem.uniforms["currentTime"] = this.currentTime;
        this.particleSystem.render();
    }
}

CV.resources.onLoaded.subscribe(function () {
    let codevisual = document.getElementById("codevisual");
    codevisual.appendChild(CV.canvas);
    CV.run(new Test());
});