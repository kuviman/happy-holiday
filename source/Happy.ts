///<reference path="CodeVisual/__package__.ts"/>

///<reference path="../shader/star/vertex.glsl.ts"/>
///<reference path="../shader/star/fragment.glsl.ts"/>
///<reference path="../shader/fireworks/vertex.glsl.ts"/>
///<reference path="../shader/fireworks/fragment.glsl.ts"/>
///<reference path="../shader/night-background-fragment.glsl.ts"/>

// let canvasSetting = new CV.RangeSetting("Canvas scaling", 1, 8);
// CV.loadSetting(canvasSetting, CV.canvasScaling, (value) => CV.canvasScaling = value);
// CV.settings.add(canvasSetting);

CV.canvasScaling = 2;

// CV.settings.domElement.style.display = "none";
// CV.stats.domElement.style.display = "none";

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
    LIFE_TIME = 1;
    DECAY_TIME = 0.2;
    static trailColor = new vec3(1, 1, 1);
    system = new CV.ParticleQueue<Fireworks.Particle>(Fireworks.shader);

    constructor() {
        this.system.maxParticles = 100000;
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
        }, this.LIFE_TIME * 1000);
    }

    positions: { [text: string]: vec2[] } = {};

    addTextFirework(text: string, to: vec2, sz: number) {
        let size = 0.1;
        let color = fromHSV(Math.random(), 1, 1);
        this.add(new vec2(random(-1, 1), -1), to, color, size);
        setTimeout(() => {
            if (!this.positions[text]) {
                let canvas = document.createElement("canvas");
                let context = canvas.getContext("2d");
                context.font = "48px serif";
                context.fillStyle = "#fff";
                canvas.width = context.measureText(text).width;
                canvas.height = 48 * 2;
                context.fillStyle = "#fff";
                context.font = "48px serif";
                context.fillText(text, 0, 48);
                let cur: vec2[] = [];
                for (let i = 0; i < 50000 * sz * sz; i++) {
                    let x = Math.random();
                    let y = Math.random();
                    if (context.getImageData(Math.floor(x * canvas.width), Math.floor(y * canvas.height), 1, 1).data[0]) {
                        cur.push(new vec2(x, y));
                    }
                }
                this.positions[text] = cur;
            }
            for (let v of this.positions[text]) {
                let newTo = vec2.mul(new vec2(v.x - 0.5, 0.5 - v.y), sz);
                newTo = new vec2(newTo.x, 2 * newTo.y * CV.canvas.width / CV.canvas.height);
                textFireworks.add(to, vec2.add(to, newTo), color, 0.035, 0.02, 2);
            }
        }, this.LIFE_TIME * 1000);
    }

    currentTime = 0;

    update(deltaTime: number) {
        this.currentTime += deltaTime;
        while (this.system.particleCount && this.system.peek().startTime < this.currentTime - this.LIFE_TIME) {
            this.system.pop();
        }
    }

    render() {
        this.system.uniforms["lifeTime"] = this.LIFE_TIME;
        this.system.uniforms["currentTime"] = this.currentTime;
        this.system.uniforms["decayTime"] = this.DECAY_TIME;
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
let textFireworks = new Fireworks();
textFireworks.LIFE_TIME = 2;
textFireworks.DECAY_TIME = 1;
CV.canvas.addEventListener("click", (e) => {
    fireworks.addFirework(new vec2(random(-1, 1), -1),
        new vec2(-1 + 2 * e.offsetX / CV.canvas.offsetWidth, 1 - 2 * e.offsetY / CV.canvas.offsetHeight),
        fromHSV(Math.random(), 1, 1), 0.1);
    e.preventDefault();
});

function say(text: string) {
    let lines = text.split("\n");
    for (let li = 0; li < lines.length; li++) {
        let line = lines[li];
        for (let i = 0; i < line.length; i++) {
            if (line[i] == ' ') {
                continue;
            }
            fireworks.addTextFirework(line[i],
                new vec2(i / (line.length - 0.5) - 0.5, 0.5 - li / (lines.length - 0.5)),
                1 / line.length);
        }
    }
}

class Happy implements CV.State {
    nextFirework = 0;

    update(deltaTime: number): void {
        background.update(deltaTime);
        fireworks.update(deltaTime);
        textFireworks.update(deltaTime);
        starSystem.update(deltaTime);
        this.nextFirework -= deltaTime;
        if (this.nextFirework < 0) {
            if (Math.random() < 0.1) {
                say("С Днем\nРождения\nЯна");
                this.nextFirework = 2.5;
            } else {
                fireworks.addFirework(new vec2(random(-1, 1), -1),
                    new vec2(random(-0.5, 0.5), random(0, 0.5)),
                    fromHSV(Math.random(), 1, 1), 0.1);
                this.nextFirework = random(0.3, 1);
            }
        }
    }

    render(): void {
        background.render();
        starSystem.render();
        fireworks.render();
        textFireworks.render();
    }
}

CV.resources.onLoaded.subscribe(function () {
    let codevisual = document.getElementById("codevisual");
    codevisual.appendChild(CV.canvas);
    CV.run(new Happy());
});