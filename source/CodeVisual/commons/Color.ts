///<reference path="__package__.ts"/>

const CHART_COLORS = [
    "#3366CC",
    "#DC3912",
    "#FF9900",
    "#109618",
    "#990099",
    "#3B3EAC",
    "#0099C6",
    "#DD4477",
    "#66AA00",
    "#B82E2E",
    "#316395",
    "#994499",
    "#22AA99",
    "#AAAA11",
    "#6633CC",
    "#E67300",
    "#8B0707",
    "#329262",
    "#5574A6",
    "#3B3EAC"];


function fromHSV(h: number, s: number, v: number) {
    h -= Math.floor(h);
    let r: number, g: number, b: number;
    let f = h * 6 - Math.floor(h * 6);
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);
    if (h * 6 < 1) {
        r = v;
        g = t;
        b = p;
    }
    else if (h * 6 < 2) {
        r = q;
        g = v;
        b = p;
    }
    else if (h * 6 < 3) {
        r = p;
        g = v;
        b = t;
    }
    else if (h * 6 < 4) {
        r = p;
        g = q;
        b = v;
    }
    else if (h * 6 < 5) {
        r = t;
        g = p;
        b = v;
    }
    else {
        r = v;
        g = p;
        b = q;
    }
    return new vec3(r, g, b);
}