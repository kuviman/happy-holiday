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

    export interface State {
        update(deltaTime: number): void;
        render(): void;
    }

    export function run(state: State): void {
        let oldTimeMs: number = Date.now();

        function frame() {
            CV.stats.frames++;
            const nowTimeMs: number = Date.now();
            const deltaTimeMs: number = nowTimeMs - oldTimeMs;
            const deltaTime: number = deltaTimeMs / 1000;
            oldTimeMs = nowTimeMs;

            const width: number = canvas.offsetWidth;
            const height: number = canvas.offsetHeight;
            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, width, height);

            state.update(deltaTime);
            state.render();
            requestAnimationFrame(frame);
        }

        frame();
    }
}