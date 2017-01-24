///<reference path="CodeVisual/__package__.ts"/>

///<reference path="../shader/star/vertex.glsl.ts"/>
///<reference path="../shader/star/fragment.glsl.ts"/>
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

class Happy implements CV.State {
    update(deltaTime: number): void {
        background.update(deltaTime);
        starSystem.update(deltaTime);
    }

    render(): void {
        background.render();
        starSystem.render();
    }
}

CV.resources.onLoaded.subscribe(function () {
    let codevisual = document.getElementById("codevisual");
    codevisual.appendChild(CV.canvas);
    CV.run(new Happy());
});