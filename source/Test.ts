///<reference path="CodeVisual/__package__.ts"/>

let gradientShader: CV.Shader;
CV.Shader.load("shader/gradient", function (shader: CV.Shader) {
    gradientShader = shader;
});
const buffer = CV.gl.createBuffer();
CV.gl.bindBuffer(CV.gl.ARRAY_BUFFER, buffer);
CV.gl.bufferData(CV.gl.ARRAY_BUFFER, Float32Array.of(-1, -1, -1, 1, 1, 1, 1, -1), CV.gl.STATIC_DRAW);

class Test implements CV.State {
    currentTime: number = 0;

    update(deltaTime: number): void {
        this.currentTime += deltaTime;
    }

    render(): void {
        CV.stats.begin("TestRender");
        const k = 100;
        for (let i = 0; i < 1000 * k; i++) {
            if (i % (100 * k) == 0) {
                if (i > 0) {
                    CV.stats.end();
                }
                CV.stats.begin("x" + i);
            }
            Math.random();
        }
        CV.stats.end();

        CV.gl.clearColor(0, 0, 0, 1);
        CV.gl.clear(CV.gl.COLOR_BUFFER_BIT);
        gradientShader.use();
        CV.gl.bindBuffer(CV.gl.ARRAY_BUFFER, buffer);
        const loc: number = gradientShader.attribLocation("attr_position");
        CV.gl.enableVertexAttribArray(loc);
        CV.gl.vertexAttribPointer(loc, 2, CV.gl.FLOAT, false, 8, 0);
        CV.gl.uniform4f(gradientShader.uniformLocation("colorIn"), 1, 1, 1, 1);
        const out = Math.sin(this.currentTime);
        CV.gl.uniform4f(gradientShader.uniformLocation("colorOut"), out, out, out, 1);
        CV.gl.drawArrays(CV.gl.TRIANGLE_FAN, 0, 4);
        CV.stats.end();
    }
}

CV.resources.onLoaded.subscribe(function () {
    let codevisual = document.getElementById("codevisual");
    codevisual.appendChild(CV.canvas);
    CV.run(new Test());
});