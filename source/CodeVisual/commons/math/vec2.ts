///<reference path="__package__.ts"/>

class vec2 {
    constructor(readonly x: number, readonly y: number) {
    }

    static rotate(v: vec2, angle: number): vec2 {
        let sn = Math.sin(angle);
        let cs = Math.cos(angle);
        return new vec2(v.x * cs - v.y * sn, v.x * sn + v.y * cs);
    }

    static add(a: vec2, b: vec2): vec2 {
        return new vec2(a.x + b.x, a.y + b.y);
    }

    static mul(v: vec2, k: number): vec2 {
        return new vec2(v.x * k, v.y * k);
    }
}