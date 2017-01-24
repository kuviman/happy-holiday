///<reference path="__package__.ts"/>

namespace CV {
    export const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    export const gl: WebGLRenderingContext = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (gl) {
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);
    }

    export function clear(r: number, g: number, b: number) {
        gl.clearColor(r, g, b, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    export interface State {
        update(deltaTime: number): void;
        render(): void;
    }

    export let maxDeltaTime: number = 0.1;
    export let canvasScaling: number = 1;

    export function run(state: State): void {
        let oldTimeMs: number = Date.now();

        function frame() {
            CV.stats.frames++;
            const nowTimeMs: number = Date.now();
            const deltaTimeMs: number = nowTimeMs - oldTimeMs;
            const deltaTime: number = Math.min(maxDeltaTime, deltaTimeMs / 1000);
            oldTimeMs = nowTimeMs;

            let pixelRatio = devicePixelRatio || 1;
            pixelRatio /= canvasScaling;
            const width: number = Math.ceil(canvas.offsetWidth * pixelRatio);
            const height: number = Math.ceil(canvas.offsetHeight * pixelRatio);
            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, canvas.width, canvas.height);

            CV.stats.begin("update");
            state.update(deltaTime);
            CV.stats.end();

            CV.stats.begin("render");
            clear(0, 0, 0);
            state.render();
            CV.stats.end();

            requestAnimationFrame(frame);
        }

        frame();
    }
}