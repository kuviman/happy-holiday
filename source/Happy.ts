///<reference path="CodeVisual/__package__.ts"/>

///<reference path="../shader/star/vertex.glsl.ts"/>
///<reference path="../shader/star/fragment.glsl.ts"/>
///<reference path="../shader/fireworks/vertex.glsl.ts"/>
///<reference path="../shader/fireworks/fragment.glsl.ts"/>
///<reference path="../shader/night-background-fragment.glsl.ts"/>

let canvasSetting = new CV.RangeSetting("Canvas scaling", 1, 8);
CV.loadSetting(canvasSetting, CV.canvasScaling, (value) => CV.canvasScaling = value);
CV.settings.add(canvasSetting);

class StarSystem extends CV.ParticleQueue<StarSystem.Star> {
    constructor() {
        super(new CV.Shader(GLSL["shader/star/vertex.glsl"], GLSL["shader/star/fragment.glsl"]));
        this.maxParticles = 100;
        let starts = new Array<number>(this.maxParticles);
        for (let i = 0; i < starts.length; i++) {
            starts[i] = random(-StarSystem.Star.LIFE_TIME, 0);
        }
        starts.sort((a, b) => a - b);
        for (let start of starts) {
            this.push(new StarSystem.Star(start));
        }
        this.uniforms["lifeTime"] = StarSystem.Star.LIFE_TIME;
        this.uniforms["blinkTime"] = 0.2;
    }

    currentTime = 0;

    update(deltaTime: number) {
        this.currentTime += deltaTime;
        while (this.peek().startTime < this.currentTime - StarSystem.Star.LIFE_TIME) {
            this.pop();
            setTimeout(() => this.push(new StarSystem.Star(this.currentTime)),
                random(1000, 2000)
            );
        }
    }

    render() {
        this.uniforms["currentTime"] = this.currentTime;
        super.render();
    }
}
namespace StarSystem {
    export class Star extends CV.Particle {
        static LIFE_TIME: number = 300;

        position: vec2 = new vec2(random(-1, 1), random(-1, 1));
        size: number = 1e-1;
        color: vec3 = fromHSV(Math.random(), 0.5, 1.0);

        constructor(public startTime: number) {
            super();
        }
    }
}
let starSystem = new StarSystem();
class Background {
    shader = new CV.FullscreenShader(GLSL["shader/night-background-fragment.glsl"]);
    currentTime = 0;

    update(deltaTime: number) {
        this.currentTime += deltaTime / 10;
        this.shader.uniforms["time"] = this.currentTime;
    }

    render() {
        this.shader.render();
    }
}
let background = new Background();

class Fireworks {
    static shader = new CV.Shader(GLSL["shader/fireworks/vertex.glsl"], GLSL["shader/fireworks/fragment.glsl"]);
    static LIFE_TIME = 1;
    static trailColor = new vec3(1, 1, 1);
    system = new CV.ParticleQueue<Fireworks.Particle>(Fireworks.shader);

    constructor() {
        this.system.maxParticles = 100000;
        this.system.uniforms["lifeTime"] = Fireworks.LIFE_TIME;
        this.system.uniforms["decayTime"] = 0.2;
    }

    add(from: vec2, to: vec2, color: vec3, size: number, trailSize: number = 0.2, trailCount: number = 30) {
        for (let i = 1; i <= trailCount; i++) {
            this.system.push(new Fireworks.Particle(from, to, Fireworks.trailColor,
                size * (0.5 - 0.5 * i / trailCount), trailSize * i / trailCount, this.currentTime, 0.1
            ))
        }
        this.system.push(new Fireworks.Particle(from, to, color, size, 0, this.currentTime, 1));
    }

    addFirework(from: vec2, to: vec2, color: vec3, size: number) {
        this.add(from, to, color, size);
        setTimeout(() => {
            for (let i = 0; i < 50; i++) {
                let newTo = vec2.rotate(new vec2(random(0.1, 0.3), 0), random(0, 2 * Math.PI));
                newTo = new vec2(newTo.x * CV.canvas.height / CV.canvas.width, newTo.y);
                this.add(to, vec2.add(to, newTo), color, size / 2, 0.05, 10);
            }
        }, Fireworks.LIFE_TIME * 1000);
    }

    currentTime = 0;

    update(deltaTime: number) {
        this.currentTime += deltaTime;
        while (this.system.particleCount && this.system.peek().startTime < this.currentTime - Fireworks.LIFE_TIME) {
            this.system.pop();
        }
    }

    render() {
        this.system.uniforms["currentTime"] = this.currentTime;
        this.system.render();
    }
}
namespace Fireworks {
    export class Particle extends CV.Particle {
        constructor(public from: vec2,
                    public to: vec2,
                    public color: vec3,
                    public size: number,
                    public dist: number,
                    public startTime: number,
                    public alpha: number) {
            super();
        }
    }
}
let fireworks = new Fireworks();
CV.canvas.addEventListener("click", (e) => {
    fireworks.addFirework(new vec2(random(-1, 1), -1),
        new vec2(-1 + 2 * e.offsetX / CV.canvas.offsetWidth, 1 - 2 * e.offsetY / CV.canvas.offsetHeight),
        fromHSV(Math.random(), 1, 1), 0.1);
    e.preventDefault();
});

setInterval(() => {
    fireworks.addFirework(new vec2(random(-1, 1), -1),
        new vec2(random(-0.5, 0.5), random(0, 0.5)),
        fromHSV(Math.random(), 1, 1), 0.1);
}, 1000);

class Happy implements CV.State {
    update(deltaTime: number): void {
        background.update(deltaTime);
        fireworks.update(deltaTime);
        starSystem.update(deltaTime);
    }

    render(): void {
        background.render();
        starSystem.render();
        fireworks.render();
    }
}

CV.resources.onLoaded.subscribe(function () {
    let codevisual = document.getElementById("codevisual");
    codevisual.appendChild(CV.canvas);
    CV.run(new Happy());
});