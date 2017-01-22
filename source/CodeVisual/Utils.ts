///<reference path="__package__.ts"/>

namespace CV {
    export const SIZEOF_FLOAT = 4;

    export function getSizeof(obj: number | vec2 | vec3 | vec4) {
        if (typeof obj === "number") {
            return SIZEOF_FLOAT;
        } else if (obj instanceof vec4) {
            return SIZEOF_FLOAT * 4;
        } else if (obj instanceof vec3) {
            return SIZEOF_FLOAT * 3;
        } else if (obj instanceof vec2) {
            return SIZEOF_FLOAT * 2;
        } else {
            throw new Error();
        }
    }

    export function putInArray(value: number | vec2 | vec3 | vec4, array: ArrayBuffer, position: number) {
        if (typeof value === "number") {
            let arrayView = new Float32Array(array, position, 1);
            arrayView[0] = value;
        } else if (value instanceof vec4) {
            let arrayView = new Float32Array(array, position, 4);
            arrayView[0] = value.x;
            arrayView[1] = value.y;
            arrayView[2] = value.z;
            arrayView[3] = value.w;
        } else if (value instanceof vec3) {
            let arrayView = new Float32Array(array, position, 3);
            arrayView[0] = value.x;
            arrayView[1] = value.y;
            arrayView[2] = value.z;
        } else if (value instanceof vec2) {
            let arrayView = new Float32Array(array, position, 2);
            arrayView[0] = value.x;
            arrayView[1] = value.y;
        } else {
            throw new Error();
        }
    }
}