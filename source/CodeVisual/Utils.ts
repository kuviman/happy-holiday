///<reference path="__package__.ts"/>

interface Number extends CV.PuttableInArray {
}
interface vec2 extends CV.PuttableInArray {
}
interface vec3 extends CV.PuttableInArray {
}
interface vec4 extends CV.PuttableInArray {
}

namespace CV {
    export interface PuttableInArray {
        CV_putInArray(array: ArrayBuffer, position: number): void;
        CV_sizeof: number;
    }

    Number.prototype.CV_putInArray = function (this: number, array: ArrayBuffer, position: number) {
        let arrayView = new Float32Array(array, position, 1);
        arrayView[0] = this;
    };
    Number.prototype.CV_sizeof = 4;

    vec2.prototype.CV_putInArray = function (this: vec2, array: ArrayBuffer, position: number) {
        let arrayView = new Float32Array(array, position, 2);
        arrayView[0] = this.x;
        arrayView[1] = this.y;
    };
    vec2.prototype.CV_sizeof = Number.prototype.CV_sizeof * 2;

    vec3.prototype.CV_putInArray = function (this: vec3, array: ArrayBuffer, position: number) {
        let arrayView = new Float32Array(array, position, 3);
        arrayView[0] = this.x;
        arrayView[1] = this.y;
        arrayView[2] = this.z;
    };
    vec3.prototype.CV_sizeof = Number.prototype.CV_sizeof * 3;

    vec4.prototype.CV_putInArray = function (this: vec4, array: ArrayBuffer, position: number) {
        let arrayView = new Float32Array(array, position, 4);
        arrayView[0] = this.x;
        arrayView[1] = this.y;
        arrayView[2] = this.z;
        arrayView[3] = this.w;
    };
    vec4.prototype.CV_sizeof = Number.prototype.CV_sizeof * 4;
}