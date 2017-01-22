///<reference path="CodeVisual/__package__.ts"/>

///<reference path="../shader/gradient/vertex.glsl.ts"/>
///<reference path="../shader/gradient/fragment.glsl.ts"/>

// let gradientShader: CV.Shader;
// CV.Shader.load("shader/gradient", function (shader: CV.Shader) {
//     gradientShader = shader;
// });
const gradientShader: CV.Shader = new CV.Shader(GLSL["shader/gradient/vertex.glsl"], GLSL["shader/gradient/fragment.glsl"]);
const buffer = CV.gl.createBuffer();
CV.gl.bindBuffer(CV.gl.ARRAY_BUFFER, buffer);
CV.gl.bufferData(CV.gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), CV.gl.STATIC_DRAW);

class Test implements CV.State {
    currentTime: number = 0;

    update(deltaTime: number): void {
        this.currentTime += deltaTime;
    }

    render(): void {
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
    }
}

CV.resources.onLoaded.subscribe(function () {
    let codevisual = document.getElementById("codevisual");
    codevisual.appendChild(CV.canvas);
    CV.run(new Test());
});