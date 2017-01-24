var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
if (!GLSL) {
    var GLSL = {};
}
GLSL["shader/star/fragment.glsl"] = "varying vec3 color;\n\nvoid main() {\n    float k = pow((1.0 - abs(gl_PointCoord.x - 0.5) * 2.0) * (1.0 - abs(gl_PointCoord.y - 0.5) * 2.0), 16.0);\n    gl_FragColor = vec4(vec3(1.0, 1.0, 1.0) * k + color * (1.0 - k), k);\n}";
if (!GLSL) {
    var GLSL = {};
}
GLSL["shader/star/vertex.glsl"] = "attribute vec2 attr_position;\nattribute float attr_size;\nattribute vec3 attr_color;\nattribute float attr_startTime;\n\nvarying vec3 color;\n\nuniform float currentTime;\nuniform float lifeTime;\nuniform float blinkTime;\n\nvoid main() {\n    color = attr_color;\n    float t = currentTime - attr_startTime;\n    float blink = (0.5 - abs(min(min(t, lifeTime - t) / blinkTime, 1.0) - 0.5)) * 2.0;\n    gl_PointSize = (1.0 + blink * 3.0) * attr_size * CV_canvasSize.y / 2.0;\n    gl_Position = vec4(attr_position, 0.0, 1.0);\n}";
var LiteEvent = (function () {
    function LiteEvent() {
        this.handlers = [];
    }
    LiteEvent.prototype.subscribe = function (handler) {
        this.handlers.push(handler);
    };
    LiteEvent.prototype.fire = function () {
        for (var _i = 0, _a = this.handlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler();
        }
    };
    return LiteEvent;
}());
var LiteEvent1 = (function () {
    function LiteEvent1() {
        this.handlers = [];
    }
    LiteEvent1.prototype.subscribe = function (handler) {
        this.handlers.push(handler);
    };
    LiteEvent1.prototype.fire = function (arg) {
        for (var _i = 0, _a = this.handlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler(arg);
        }
    };
    return LiteEvent1;
}());
var CHART_COLORS = [
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
function fromHSV(h, s, v) {
    h -= Math.floor(h);
    var r, g, b;
    var f = h * 6 - Math.floor(h * 6);
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
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
var customStyleSheet = function () {
    var style = document.createElement("style");
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    return style.sheet;
}();
function addCssRule(selector, rule) {
    if ("insertRule" in customStyleSheet) {
        customStyleSheet.insertRule(selector + "{" + rule + "}", 0);
    }
    else if ("addRule" in customStyleSheet) {
        customStyleSheet.addRule(selector, rule, 0);
    }
}
function createHtml(html) {
    var div = document.createElement("div");
    div.innerHTML = html;
    return div.childNodes[0];
}
var vec2 = (function () {
    function vec2(x, y) {
        this.x = x;
        this.y = y;
    }
    vec2.rotate = function (v, angle) {
        var sn = Math.sin(angle);
        var cs = Math.cos(angle);
        return new vec2(v.x * cs - v.y * sn, v.x * sn + v.y * cs);
    };
    vec2.add = function (a, b) {
        return new vec2(a.x + b.x, a.y + b.y);
    };
    vec2.mul = function (v, k) {
        return new vec2(v.x * k, v.y * k);
    };
    return vec2;
}());
var vec3 = (function () {
    function vec3(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    return vec3;
}());
var vec4 = (function () {
    function vec4(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    return vec4;
}());
window.isMobile = function () {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};
function random(a, b) {
    return a + Math.random() * (b - a);
}
var CV;
(function (CV) {
    Number.prototype.CV_putInArray = function (array, position) {
        var arrayView = new Float32Array(array, position, 1);
        arrayView[0] = this;
    };
    Number.prototype.CV_sizeof = 4;
    vec2.prototype.CV_putInArray = function (array, position) {
        var arrayView = new Float32Array(array, position, 2);
        arrayView[0] = this.x;
        arrayView[1] = this.y;
    };
    vec2.prototype.CV_sizeof = Number.prototype.CV_sizeof * 2;
    vec3.prototype.CV_putInArray = function (array, position) {
        var arrayView = new Float32Array(array, position, 3);
        arrayView[0] = this.x;
        arrayView[1] = this.y;
        arrayView[2] = this.z;
    };
    vec3.prototype.CV_sizeof = Number.prototype.CV_sizeof * 3;
    vec4.prototype.CV_putInArray = function (array, position) {
        var arrayView = new Float32Array(array, position, 4);
        arrayView[0] = this.x;
        arrayView[1] = this.y;
        arrayView[2] = this.z;
        arrayView[3] = this.w;
    };
    vec4.prototype.CV_sizeof = Number.prototype.CV_sizeof * 4;
})(CV || (CV = {}));
var CV;
(function (CV) {
    CV.canvas = document.createElement("canvas");
    CV.canvas.style.width = "100%";
    CV.canvas.style.height = "100%";
    CV.gl = CV.canvas.getContext("webgl") || CV.canvas.getContext("experimental-webgl");
    if (CV.gl) {
        CV.gl.enable(CV.gl.BLEND);
        CV.gl.blendFuncSeparate(CV.gl.SRC_ALPHA, CV.gl.ONE_MINUS_SRC_ALPHA, CV.gl.ZERO, CV.gl.ONE);
    }
    function clear(r, g, b) {
        CV.gl.clearColor(r, g, b, 1);
        CV.gl.clear(CV.gl.COLOR_BUFFER_BIT);
    }
    CV.clear = clear;
    CV.maxDeltaTime = 0.1;
    CV.canvasScaling = 1;
    function run(state) {
        var oldTimeMs = Date.now();
        function frame() {
            CV.stats.frames++;
            var nowTimeMs = Date.now();
            var deltaTimeMs = nowTimeMs - oldTimeMs;
            var deltaTime = Math.min(CV.maxDeltaTime, deltaTimeMs / 1000);
            oldTimeMs = nowTimeMs;
            var pixelRatio = devicePixelRatio || 1;
            pixelRatio /= CV.canvasScaling;
            var width = Math.ceil(CV.canvas.offsetWidth * pixelRatio);
            var height = Math.ceil(CV.canvas.offsetHeight * pixelRatio);
            CV.canvas.width = width;
            CV.canvas.height = height;
            CV.gl.viewport(0, 0, CV.canvas.width, CV.canvas.height);
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
    CV.run = run;
})(CV || (CV = {}));
var CV;
(function (CV) {
    var Resource = (function () {
        function Resource(name) {
            this.name = name;
            this.loaded = false;
            this.onLoaded = new LiteEvent();
            CV.resources.queue(this);
        }
        Resource.prototype.confirmLoaded = function () {
            this.loaded = true;
            this.onLoaded.fire();
        };
        return Resource;
    }());
    CV.Resource = Resource;
    var FakeResource = (function (_super) {
        __extends(FakeResource, _super);
        function FakeResource(name) {
            _super.call(this, name);
        }
        FakeResource.prototype.load = function () {
        };
        return FakeResource;
    }(Resource));
    CV.FakeResource = FakeResource;
    var ResourceManager = (function () {
        function ResourceManager(simultaneousCount) {
            this.simultaneousCount = simultaneousCount;
            this.buffer = [];
            this.currentlyLoadingNonFake = 0;
            this.currentlyLoading = [];
            this._totalCount = 0;
            this._loadedCount = 0;
            this.onLoaded = new LiteEvent();
        }
        Object.defineProperty(ResourceManager.prototype, "totalCount", {
            get: function () {
                return this._totalCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResourceManager.prototype, "loadedCount", {
            get: function () {
                return this._loadedCount;
            },
            enumerable: true,
            configurable: true
        });
        ResourceManager.prototype.queue = function (resource) {
            this._totalCount++;
            if (resource instanceof FakeResource) {
                this.startLoad(resource);
            }
            else {
                this.buffer.push(resource);
                this.tryLoadMore();
            }
        };
        ResourceManager.prototype.startLoad = function (resource) {
            var _this = this;
            console.log("Started: " + resource.name);
            this.currentlyLoading.push(resource);
            resource.onLoaded.subscribe(function () {
                console.log("Finished: " + resource.name);
                _this.currentlyLoading.splice(_this.currentlyLoading.indexOf(resource));
                if (!(resource instanceof FakeResource)) {
                    _this.currentlyLoadingNonFake--;
                }
                _this._loadedCount++;
                _this.tryLoadMore();
            });
            if (!(resource instanceof FakeResource)) {
                this.currentlyLoadingNonFake++;
            }
            resource.load();
        };
        ResourceManager.prototype.tryLoadMore = function () {
            var _this = this;
            while (this.buffer.length != 0 && this.currentlyLoadingNonFake < this.simultaneousCount) {
                this.startLoad(this.buffer.shift());
            }
            if (this._loadedCount == this._totalCount) {
                setTimeout(function () { return _this.onLoaded.fire(); });
            }
        };
        return ResourceManager;
    }());
    CV.resources = new ResourceManager(1);
    var CombinedResource = (function (_super) {
        __extends(CombinedResource, _super);
        function CombinedResource(name) {
            var _this = this;
            var parts = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                parts[_i - 1] = arguments[_i];
            }
            _super.call(this, name);
            var resourcesLeft = parts.length;
            for (var _a = 0, parts_1 = parts; _a < parts_1.length; _a++) {
                var part = parts_1[_a];
                part.onLoaded.subscribe(function () {
                    resourcesLeft--;
                    if (resourcesLeft == 0) {
                        _this.confirmLoaded();
                    }
                });
            }
        }
        return CombinedResource;
    }(FakeResource));
    CV.CombinedResource = CombinedResource;
    function loadText(url, callback) {
        return new (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                _super.call(this, url);
            }
            class_1.prototype.load = function () {
                var _this = this;
                var request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.onload = function () {
                    callback(request.responseText);
                    _this.confirmLoaded();
                };
                request.send();
            };
            return class_1;
        }(Resource))();
    }
    CV.loadText = loadText;
    var windowResource = new FakeResource("window.load");
    window.addEventListener("load", function () { return windowResource.confirmLoaded(); });
})(CV || (CV = {}));
if (!GLSL) {
    var GLSL = {};
}
GLSL["shader/noise/noise2D.glsl"] = "//\n// Description : Array and textureless GLSL 2D simplex noise function.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : stegu\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//               https://github.com/stegu/webgl-noise\n//\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec2 mod289(vec2 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec3 permute(vec3 x) {\n  return mod289(((x*34.0)+1.0)*x);\n}\n\nfloat snoise(vec2 v)\n  {\n  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0\n                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)\n                     -0.577350269189626,  // -1.0 + 2.0 * C.x\n                      0.024390243902439); // 1.0 / 41.0\n// First corner\n  vec2 i  = floor(v + dot(v, C.yy) );\n  vec2 x0 = v -   i + dot(i, C.xx);\n\n// Other corners\n  vec2 i1;\n  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0\n  //i1.y = 1.0 - i1.x;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  // x0 = x0 - 0.0 + 0.0 * C.xx ;\n  // x1 = x0 - i1 + 1.0 * C.xx ;\n  // x2 = x0 - 1.0 + 2.0 * C.xx ;\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n\n// Permutations\n  i = mod289(i); // Avoid truncation effects in permutation\n  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))\n\t\t+ i.x + vec3(0.0, i1.x, 1.0 ));\n\n  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n  m = m*m ;\n  m = m*m ;\n\n// Gradients: 41 points uniformly over a line, mapped onto a diamond.\n// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\n\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n\n// Normalise gradients implicitly by scaling m\n// Approximation of: m *= inversesqrt( a0*a0 + h*h );\n  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n\n// Compute final noise value at P\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}";
if (!GLSL) {
    var GLSL = {};
}
GLSL["shader/CV/builtins.glsl"] = "uniform vec2 CV_canvasSize;";
var CV;
(function (CV) {
    Number.prototype.CV_glType = { sizeof: Number.prototype.CV_sizeof, size: 1, type: CV.gl.FLOAT };
    vec2.prototype.CV_glType = { sizeof: vec2.prototype.CV_sizeof, size: 2, type: CV.gl.FLOAT };
    vec3.prototype.CV_glType = { sizeof: vec3.prototype.CV_sizeof, size: 3, type: CV.gl.FLOAT };
    vec4.prototype.CV_glType = { sizeof: vec4.prototype.CV_sizeof, size: 4, type: CV.gl.FLOAT };
    Number.prototype.CV_applyAsUniform = function (location) {
        CV.gl.uniform1f(location, this);
    };
    vec2.prototype.CV_applyAsUniform = function (location) {
        CV.gl.uniform2f(location, this.x, this.y);
    };
    vec3.prototype.CV_applyAsUniform = function (location) {
        CV.gl.uniform3f(location, this.x, this.y, this.z);
    };
    vec4.prototype.CV_applyAsUniform = function (location) {
        CV.gl.uniform4f(location, this.x, this.y, this.z, this.w);
    };
    function compileShader(type, source) {
        var shader = CV.gl.createShader(type);
        source = GLSL["shader/noise/noise2D.glsl"] + source;
        source = GLSL["shader/CV/builtins.glsl"] + source;
        source = "precision mediump float;\n" + source;
        CV.gl.shaderSource(shader, source);
        CV.gl.compileShader(shader);
        if (!CV.gl.getShaderParameter(shader, CV.gl.COMPILE_STATUS)) {
            throw new Error(CV.gl.getShaderInfoLog(shader));
        }
        return shader;
    }
    var Shader = (function () {
        function Shader(vertexSource, fragmentSource) {
            this.attributes = {};
            this.uniforms = {};
            this.program = CV.gl.createProgram();
            CV.gl.attachShader(this.program, compileShader(CV.gl.VERTEX_SHADER, vertexSource));
            CV.gl.attachShader(this.program, compileShader(CV.gl.FRAGMENT_SHADER, fragmentSource));
            CV.gl.linkProgram(this.program);
            if (!CV.gl.getProgramParameter(this.program, CV.gl.LINK_STATUS)) {
                throw new Error(CV.gl.getProgramInfoLog(this.program));
            }
        }
        Shader.prototype.use = function () {
            CV.gl.useProgram(this.program);
        };
        Shader.load = function (url, callback) {
            var vertexSource;
            var fragmentSource;
            var vertexResource = CV.loadText(url + "/vertex.glsl", function (source) { return vertexSource = source; });
            var fragmentResource = CV.loadText(url + "/fragment.glsl", function (source) { return fragmentSource = source; });
            var shaderResource = new CV.CombinedResource("Shader(" + url + ")", vertexResource, fragmentResource);
            shaderResource.onLoaded.subscribe(function () {
                callback(new Shader(vertexSource, fragmentSource));
            });
            return shaderResource;
        };
        Shader.prototype.attribLocation = function (name) {
            var result = this.attributes[name];
            if (result) {
                return result;
            }
            result = CV.gl.getAttribLocation(this.program, "attr_" + name);
            this.attributes[name] = result;
            return result;
        };
        Shader.prototype.uniformLocation = function (name) {
            var result = this.uniforms[name];
            if (result) {
                return result;
            }
            return this.uniforms[name] = CV.gl.getUniformLocation(this.program, name);
        };
        Shader.prototype.applyUniforms = function (uniforms) {
            this.use();
            for (var name_1 in uniforms) {
                var uniform = uniforms[name_1];
                var location_1 = this.uniformLocation(name_1);
                uniform.CV_applyAsUniform(location_1);
            }
            new vec2(CV.canvas.width, CV.canvas.height).CV_applyAsUniform(this.uniformLocation("CV_canvasSize"));
        };
        Shader.prototype.bindAttribute = function (name, type, offset, stride) {
            var location = this.attribLocation(name);
            if (location == -1) {
                return;
            }
            CV.gl.enableVertexAttribArray(location);
            CV.gl.vertexAttribPointer(location, type.size, type.type, false, stride, offset);
        };
        return Shader;
    }());
    CV.Shader = Shader;
})(CV || (CV = {}));
var CV;
(function (CV) {
    var StaticModel = (function () {
        function StaticModel() {
        }
        return StaticModel;
    }());
    CV.StaticModel = StaticModel;
})(CV || (CV = {}));
var CV;
(function (CV) {
    var Widget = (function () {
        function Widget(name, content) {
            var title = document.createElement("div");
            title.className = "codevisual-widget__title";
            title.innerText = name;
            this.titleElement = title;
            var contentElement = document.createElement("div");
            contentElement.className = "codevisual-widget__content";
            contentElement.appendChild(content);
            var domElement = document.createElement("div");
            domElement.className = "codevisual-widget";
            domElement.appendChild(title);
            domElement.appendChild(contentElement);
            this.domElement = domElement;
            this.setupMouseDragging();
            this.setupTouchDragging();
        }
        Widget.prototype.setupMouseDragging = function () {
            var _this = this;
            var dragOffset;
            var mouseMove = function (e) {
                _this.domElement.style.left = (e.clientX - dragOffset[0]) + "px";
                _this.domElement.style.top = (e.clientY - dragOffset[1]) + "px";
                _this.domElement.style.right = "auto";
                _this.domElement.style.bottom = "auto";
                e.preventDefault();
                e.stopPropagation();
            };
            var mouseDown = function (e) {
                if (e.button == 0) {
                    dragOffset = [e.clientX - _this.domElement.offsetLeft, e.clientY - _this.domElement.offsetTop];
                    window.addEventListener("mousemove", mouseMove, true);
                    e.preventDefault();
                    e.stopPropagation();
                }
            };
            function mouseUp(e) {
                if (dragOffset) {
                    window.removeEventListener("mousemove", mouseMove, true);
                    e.preventDefault();
                    e.stopPropagation();
                    dragOffset = undefined;
                }
            }
            this.titleElement.addEventListener("mousedown", mouseDown, false);
            this.titleElement.addEventListener("mouseup", mouseUp, false);
        };
        Widget.prototype.setupTouchDragging = function () {
            var _this = this;
            var dragOffset;
            var touchMove = function (e) {
                _this.domElement.style.left = (e.touches[0].clientX - dragOffset[0]) + "px";
                _this.domElement.style.top = (e.touches[0].clientY - dragOffset[1]) + "px";
                _this.domElement.style.right = "auto";
                _this.domElement.style.bottom = "auto";
                e.preventDefault();
                e.stopPropagation();
            };
            var touchDown = function (e) {
                if (e.touches.length == 1) {
                    dragOffset = [e.touches[0].clientX - _this.domElement.offsetLeft,
                        e.touches[0].clientY - _this.domElement.offsetTop];
                    window.addEventListener("touchmove", touchMove, true);
                    e.preventDefault();
                    e.stopPropagation();
                }
            };
            function touchUp(e) {
                if (dragOffset) {
                    window.removeEventListener("mousemove", touchMove, true);
                    e.preventDefault();
                    e.stopPropagation();
                    dragOffset = undefined;
                }
            }
            this.titleElement.addEventListener("touchstart", touchDown, false);
            this.titleElement.addEventListener("touchend", touchUp, false);
        };
        Object.defineProperty(Widget.prototype, "title", {
            set: function (value) {
                this.titleElement.innerText = value;
            },
            enumerable: true,
            configurable: true
        });
        return Widget;
    }());
    CV.Widget = Widget;
})(CV || (CV = {}));
var CV;
(function (CV) {
    var StatsData = (function () {
        function StatsData(name) {
            this.name = name;
            this.timeConsumed = 0;
            this.children = {};
        }
        StatsData.prototype.begin = function () {
            this.beginTime = Date.now();
        };
        StatsData.prototype.end = function () {
            this.timeConsumed += Date.now() - this.beginTime;
        };
        StatsData.prototype.subData = function (name) {
            var result = this.children[name];
            if (!result) {
                result = this.children[name] = new StatsData(name);
            }
            return result;
        };
        return StatsData;
    }());
    var Stats = (function (_super) {
        __extends(Stats, _super);
        function Stats() {
            var _this = this;
            var container = document.createElement("div");
            var canvas = document.createElement("canvas");
            canvas.width = 100;
            canvas.height = 100;
            _super.call(this, "Stats", container);
            this.canvas = canvas;
            this.legend = document.createElement("ol");
            this.legend.style.marginTop = "0";
            this.legend.style.marginRight = "1em";
            container.appendChild(canvas);
            container.appendChild(this.legend);
            this.watchesElement = document.createElement("ul");
            this.watchesElement.style.marginRight = "1em";
            container.appendChild(this.watchesElement);
            this.context = this.canvas.getContext("2d");
            this.data = [];
            this.lastUpdate = Date.now();
            this.watches = {};
            window.addEventListener("load", function () {
                document.body.appendChild(_this.domElement);
            });
            this.disabled = false;
        }
        Object.defineProperty(Stats.prototype, "disabled", {
            get: function () {
                return this._disabled;
            },
            set: function (value) {
                var _this = this;
                this._disabled = value;
                if (!value) {
                    setTimeout(function () {
                        _this.update();
                    });
                }
            },
            enumerable: true,
            configurable: true
        });
        Stats.prototype.begin = function (name) {
            if (this.data.length == 0) {
                this.data.push(new StatsData("root"));
            }
            var neededData = this.data[this.data.length - 1].subData(name);
            neededData.begin();
            this.data.push(neededData);
        };
        Stats.prototype.end = function () {
            this.data.pop().end();
        };
        Stats.prototype.update = function () {
            var _this = this;
            if (!this.disabled) {
                setTimeout(function () {
                    _this.update();
                }, 1000);
            }
            if (this.data.length == 0) {
                return;
            }
            var nowTime = Date.now();
            this.colorIndex = -1;
            var root = this.data[0];
            var timeElapsed = nowTime - this.lastUpdate;
            root.timeConsumed = 0;
            for (var name_2 in root.children) {
                root.timeConsumed += root.children[name_2].timeConsumed;
            }
            this.title = "FPS: " + ((timeElapsed && this.frames) ? Math.round(this.frames / (timeElapsed / 1000)).toString() : 0);
            if (root.timeConsumed == 0) {
                return;
            }
            root.subData("idle").timeConsumed = timeElapsed - root.timeConsumed;
            root.timeConsumed = timeElapsed;
            this.allData = [];
            while (this.legend.hasChildNodes()) {
                this.legend.removeChild(this.legend.lastChild);
            }
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.render(root, 1, 0, 2 * Math.PI);
            this.allData.sort(function (a, b) { return b.timeConsumed - a.timeConsumed; });
            var index = 0;
            for (var _i = 0, _a = this.allData; _i < _a.length; _i++) {
                var data = _a[_i];
                var description = document.createElement("li");
                description.style.color = CHART_COLORS[data.assignedColor];
                description.innerText = data.name + ": "
                    + data.timeConsumed + "ms"
                    + " (" + Math.round(100 * data.timeConsumed / this.data[0].timeConsumed) + "%)";
                this.legend.appendChild(description);
            }
            this.lastUpdate = nowTime;
            this.data = [];
            this.frames = 0;
        };
        Stats.prototype.render = function (data, radius, angleFrom, angleTo) {
            if (this.colorIndex >= 0) {
                this.context.save();
                var centerX = Math.floor(this.canvas.width / 2);
                var centerY = Math.floor(this.canvas.height / 2);
                var realRadius = Math.floor(Math.min(this.canvas.width, this.canvas.height) / 2) * radius;
                this.context.beginPath();
                this.context.moveTo(centerX, centerY);
                this.context.arc(centerX, centerY, realRadius, angleFrom, angleTo, false);
                this.context.closePath();
                this.context.fillStyle = CHART_COLORS[this.colorIndex];
                this.context.fill();
                this.context.restore();
                data.assignedColor = this.colorIndex;
                this.allData.push(data);
            }
            this.colorIndex++;
            var currentAngle = angleFrom;
            for (var name_3 in data.children) {
                var child = data.children[name_3];
                var span = (angleTo - angleFrom) * child.timeConsumed / data.timeConsumed;
                this.render(child, radius * 0.8, currentAngle, currentAngle + span);
                currentAngle += span;
            }
        };
        Stats.prototype.watch = function (name, value) {
            if (!this.watches[name]) {
                this.watches[name] = document.createElement("li");
                this.watchesElement.appendChild(this.watches[name]);
            }
            this.watches[name].innerText = name + ": " + value;
        };
        return Stats;
    }(CV.Widget));
    CV.Stats = Stats;
    CV.stats = new Stats();
})(CV || (CV = {}));
var CV;
(function (CV) {
    var Particle = (function () {
        function Particle() {
        }
        return Particle;
    }());
    CV.Particle = Particle;
    var ParticleSystem = (function () {
        function ParticleSystem(shader) {
            this.shader = shader;
            this.particles = [];
            this.uniforms = {};
            this.attributes = {};
            this.buffer = CV.gl.createBuffer();
        }
        ParticleSystem.prototype.render = function () {
            if (this.particles.length == 0) {
                return;
            }
            this.shader.applyUniforms(this.uniforms);
            CV.gl.bindBuffer(CV.gl.ARRAY_BUFFER, this.buffer);
            if (!this.data || this.sizeofT * this.particles.length > this.data.byteLength) {
                var particle = this.particles[0];
                this.sizeofT = 0;
                for (var name_4 in particle) {
                    if (particle.hasOwnProperty(name_4) && this.shader.attribLocation(name_4) != -1) {
                        var attribute = particle[name_4];
                        var type = attribute.CV_glType;
                        this.attributes[name_4] = { type: type, offset: this.sizeofT };
                        this.sizeofT += type.sizeof;
                    }
                }
                this.data = new ArrayBuffer(Math.ceil(this.sizeofT * this.particles.length * 1.5));
            }
            for (var i = 0; i < this.particles.length; i++) {
                var particle = this.particles[i];
                for (var name_5 in this.attributes) {
                    var attribute = particle[name_5];
                    attribute.CV_putInArray(this.data, this.sizeofT * i + this.attributes[name_5].offset);
                }
            }
            for (var name_6 in this.attributes) {
                var attribute = this.attributes[name_6];
                this.shader.bindAttribute(name_6, attribute.type, attribute.offset, this.sizeofT);
            }
            CV.gl.bufferData(CV.gl.ARRAY_BUFFER, this.data, CV.gl.DYNAMIC_DRAW);
            CV.gl.drawArrays(CV.gl.POINTS, 0, this.particles.length);
        };
        return ParticleSystem;
    }());
    CV.ParticleSystem = ParticleSystem;
})(CV || (CV = {}));
var CV;
(function (CV) {
    var ParticleQueue = (function () {
        function ParticleQueue(shader) {
            this.shader = shader;
            this.particles = [];
            this.maxParticles = 512;
            this.uniforms = {};
            this.attributes = {};
            this.head = 0;
            this.tail = 0;
            this.buffer = CV.gl.createBuffer();
        }
        Object.defineProperty(ParticleQueue.prototype, "particleCount", {
            get: function () {
                var result = this.tail - this.head;
                if (result < 0) {
                    result = this.particles.length + result;
                }
                return result;
            },
            enumerable: true,
            configurable: true
        });
        ParticleQueue.prototype.push = function (particle) {
            CV.gl.bindBuffer(CV.gl.ARRAY_BUFFER, this.buffer);
            if (this.particles.length != this.maxParticles + 1) {
                this.head = this.tail = 0;
                this.particles.length = this.maxParticles + 1;
                this.sizeofT = 0;
                for (var name_7 in particle) {
                    if (particle.hasOwnProperty(name_7) && this.shader.attribLocation(name_7) != -1) {
                        var attribute = particle[name_7];
                        var type = attribute.CV_glType;
                        this.attributes[name_7] = { type: type, offset: this.sizeofT };
                        this.sizeofT += type.sizeof;
                    }
                }
                this.data = new ArrayBuffer(this.sizeofT);
                CV.gl.bufferData(CV.gl.ARRAY_BUFFER, this.particles.length * this.sizeofT, CV.gl.DYNAMIC_DRAW);
            }
            for (var name_8 in this.attributes) {
                var attribute = particle[name_8];
                attribute.CV_putInArray(this.data, this.attributes[name_8].offset);
            }
            CV.gl.bufferSubData(CV.gl.ARRAY_BUFFER, this.sizeofT * this.tail, this.data);
            this.particles[this.tail] = particle;
            this.tail = (this.tail + 1) % this.particles.length;
            if (this.tail == this.head) {
                this.head = (this.head + 1) % this.particles.length;
            }
        };
        ParticleQueue.prototype.peek = function () {
            return this.head == this.tail ? null : this.particles[this.head];
        };
        ParticleQueue.prototype.pop = function () {
            var result = this.peek();
            this.head = (this.head + 1) % this.particles.length;
            return result;
        };
        ParticleQueue.prototype.render = function () {
            if (this.head == this.tail) {
                return;
            }
            this.shader.applyUniforms(this.uniforms);
            CV.gl.bindBuffer(CV.gl.ARRAY_BUFFER, this.buffer);
            for (var name_9 in this.attributes) {
                var attribute = this.attributes[name_9];
                this.shader.bindAttribute(name_9, attribute.type, attribute.offset, this.sizeofT);
            }
            if (this.head < this.tail) {
                CV.gl.drawArrays(CV.gl.POINTS, this.head, this.tail - this.head);
            }
            else {
                CV.gl.drawArrays(CV.gl.POINTS, this.head, this.particles.length - this.head);
                if (this.tail != 0) {
                    CV.gl.drawArrays(CV.gl.POINTS, 0, this.tail);
                }
            }
        };
        return ParticleQueue;
    }());
    CV.ParticleQueue = ParticleQueue;
})(CV || (CV = {}));
var CV;
(function (CV) {
    function loadSetting(setting, defaultValue, onChange) {
        var localStorageName = "CV_Setting::" + setting.name;
        var value = defaultValue;
        if (localStorage[localStorageName]) {
            value = JSON.parse(localStorage[localStorageName]);
        }
        setting.value = value;
        if (onChange) {
            onChange(value);
        }
        setting.onChange.subscribe(function (value) {
            localStorage[localStorageName] = JSON.stringify(value);
            if (onChange) {
                onChange(value);
            }
        });
    }
    CV.loadSetting = loadSetting;
    var RangeSetting = (function () {
        function RangeSetting(name, min, max, step) {
            var _this = this;
            if (step === void 0) { step = 1; }
            this.name = name;
            this.min = min;
            this.max = max;
            this.step = step;
            this.inputElement = document.createElement("input");
            this.onChange = new LiteEvent1();
            this.inputElement.type = "range";
            this.inputElement.min = min.toString();
            this.inputElement.max = max.toString();
            this.inputElement.step = step.toString();
            this.inputElement.addEventListener("change", function () { return _this.onChange.fire(_this.value); });
        }
        Object.defineProperty(RangeSetting.prototype, "value", {
            get: function () {
                return parseFloat(this.inputElement.value);
            },
            set: function (x) {
                this.inputElement.value = x.toString();
            },
            enumerable: true,
            configurable: true
        });
        return RangeSetting;
    }());
    CV.RangeSetting = RangeSetting;
    var Settings = (function (_super) {
        __extends(Settings, _super);
        function Settings() {
            var _this = this;
            var table = document.createElement("table");
            _super.call(this, "Settings", table);
            this.table = table;
            window.addEventListener("load", function () {
                _this.domElement.style.left = "auto";
                _this.domElement.style.top = "auto";
                _this.domElement.style.right = "0";
                _this.domElement.style.bottom = "0";
                document.body.appendChild(_this.domElement);
            });
        }
        Settings.prototype.add = function (setting) {
            var row = document.createElement("tr");
            var nameTD = document.createElement("td");
            nameTD.innerText = setting.name;
            var inputTD = document.createElement("td");
            inputTD.appendChild(setting.inputElement);
            row.appendChild(nameTD);
            row.appendChild(inputTD);
            this.table.appendChild(row);
        };
        return Settings;
    }(CV.Widget));
    CV.Settings = Settings;
    CV.settings = new Settings();
})(CV || (CV = {}));
if (!GLSL) {
    var GLSL = {};
}
GLSL["shader/fullscreen-vertex.glsl"] = "attribute vec2 attr_position;\n\nvoid main() {\n    gl_Position = vec4(attr_position, 0.0, 1.0);\n}";
var CV;
(function (CV) {
    var FullscreenShader = (function () {
        function FullscreenShader(fragmentSource) {
            this.uniforms = {};
            this.shader = new CV.Shader(GLSL["shader/fullscreen-vertex.glsl"], fragmentSource);
        }
        FullscreenShader.initialize = function () {
            this.buffer = CV.gl.createBuffer();
            CV.gl.bindBuffer(CV.gl.ARRAY_BUFFER, this.buffer);
            CV.gl.bufferData(CV.gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), CV.gl.STATIC_DRAW);
        };
        FullscreenShader.prototype.render = function () {
            CV.gl.bindBuffer(CV.gl.ARRAY_BUFFER, FullscreenShader.buffer);
            this.shader.bindAttribute("position", vec2.prototype.CV_glType, 0, vec2.prototype.CV_sizeof);
            this.shader.applyUniforms(this.uniforms);
            CV.gl.drawArrays(CV.gl.TRIANGLE_FAN, 0, 4);
        };
        return FullscreenShader;
    }());
    CV.FullscreenShader = FullscreenShader;
    if (CV.gl) {
        FullscreenShader.initialize();
    }
})(CV || (CV = {}));
if (!GLSL) {
    var GLSL = {};
}
GLSL["shader/night-background-fragment.glsl"] = "uniform float time;\n\nvoid main() {\n    float kRed = snoise(1.2 * gl_FragCoord.xy / CV_canvasSize.y + vec2(1, 0.2) * time);\n    float kGreen = snoise(0.7 * (gl_FragCoord.xy / CV_canvasSize.y + vec2(5, 1)) + vec2(-1, 0.4) * time);\n    float kBlue = snoise(1.0 * (gl_FragCoord.xy / CV_canvasSize.y + vec2(3, 7)) + vec2(0.5, 0.7) * time);\n    gl_FragColor = vec4(kRed * 0.03, kGreen * 0.03, kBlue * 0.1, 1.0);\n}";
var canvasSetting = new CV.RangeSetting("Canvas scaling", 1, 8);
CV.loadSetting(canvasSetting, CV.canvasScaling, function (value) { return CV.canvasScaling = value; });
CV.settings.add(canvasSetting);
var StarSystem = (function (_super) {
    __extends(StarSystem, _super);
    function StarSystem() {
        _super.call(this, new CV.Shader(GLSL["shader/star/vertex.glsl"], GLSL["shader/star/fragment.glsl"]));
        this.currentTime = 0;
        this.maxParticles = 100;
        var starts = new Array(this.maxParticles);
        for (var i = 0; i < starts.length; i++) {
            starts[i] = random(-StarSystem.Star.LIFE_TIME, 0);
        }
        starts.sort(function (a, b) { return a - b; });
        for (var _i = 0, starts_1 = starts; _i < starts_1.length; _i++) {
            var start = starts_1[_i];
            this.push(new StarSystem.Star(start));
        }
        this.uniforms["lifeTime"] = StarSystem.Star.LIFE_TIME;
        this.uniforms["blinkTime"] = 0.2;
    }
    StarSystem.prototype.update = function (deltaTime) {
        this.currentTime += deltaTime;
        while (this.peek().startTime < this.currentTime - StarSystem.Star.LIFE_TIME) {
            this.pop();
            this.push(new StarSystem.Star(this.currentTime));
        }
    };
    StarSystem.prototype.render = function () {
        this.uniforms["currentTime"] = this.currentTime;
        _super.prototype.render.call(this);
    };
    return StarSystem;
}(CV.ParticleQueue));
var StarSystem;
(function (StarSystem) {
    var Star = (function (_super) {
        __extends(Star, _super);
        function Star(startTime) {
            _super.call(this);
            this.startTime = startTime;
            this.position = new vec2(random(-1, 1), random(-1, 1));
            this.size = 1e-1;
            this.color = fromHSV(Math.random(), 1.0, 1.0);
        }
        Star.LIFE_TIME = 300;
        return Star;
    }(CV.Particle));
    StarSystem.Star = Star;
})(StarSystem || (StarSystem = {}));
var starSystem = new StarSystem();
var Background = (function () {
    function Background() {
        this.shader = new CV.FullscreenShader(GLSL["shader/night-background-fragment.glsl"]);
        this.currentTime = 0;
    }
    Background.prototype.update = function (deltaTime) {
        this.currentTime += deltaTime / 10;
        this.shader.uniforms["time"] = this.currentTime;
    };
    Background.prototype.render = function () {
        this.shader.render();
    };
    return Background;
}());
var background = new Background();
var Happy = (function () {
    function Happy() {
    }
    Happy.prototype.update = function (deltaTime) {
        background.update(deltaTime);
        starSystem.update(deltaTime);
    };
    Happy.prototype.render = function () {
        background.render();
        starSystem.render();
    };
    return Happy;
}());
CV.resources.onLoaded.subscribe(function () {
    var codevisual = document.getElementById("codevisual");
    codevisual.appendChild(CV.canvas);
    CV.run(new Happy());
});
//# sourceMappingURL=CodeVisual.js.map