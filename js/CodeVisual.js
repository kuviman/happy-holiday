var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
if (!GLSL) {
    var GLSL = {};
}
GLSL["shader/gradient/fragment.glsl"] = "varying vec2 position;\nuniform vec4 colorIn, colorOut;\nvoid main() {\n    float kOut = min(length(position), 1.0);\n    gl_FragColor = colorOut * kOut + (1.0 - kOut) * colorIn;\n}";
if (!GLSL) {
    var GLSL = {};
}
GLSL["shader/gradient/vertex.glsl"] = "attribute vec2 attr_position;\nvarying vec2 position;\nvoid main() {\n    position = attr_position;\n    gl_Position = vec4(attr_position, 0.0, 1.0);\n}";
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
var CV;
(function (CV) {
    CV.SIZEOF_FLOAT = 4;
    function getSizeof(obj) {
        if (typeof obj === "number") {
            return CV.SIZEOF_FLOAT;
        }
        else if (obj instanceof vec4) {
            return CV.SIZEOF_FLOAT * 4;
        }
        else if (obj instanceof vec3) {
            return CV.SIZEOF_FLOAT * 3;
        }
        else if (obj instanceof vec2) {
            return CV.SIZEOF_FLOAT * 2;
        }
        else {
            throw new Error();
        }
    }
    CV.getSizeof = getSizeof;
    function putInArray(value, array, position) {
        if (typeof value === "number") {
            var arrayView = new Float32Array(array, position, 1);
            arrayView[0] = value;
        }
        else if (value instanceof vec4) {
            var arrayView = new Float32Array(array, position, 4);
            arrayView[0] = value.x;
            arrayView[1] = value.y;
            arrayView[2] = value.z;
            arrayView[3] = value.w;
        }
        else if (value instanceof vec3) {
            var arrayView = new Float32Array(array, position, 3);
            arrayView[0] = value.x;
            arrayView[1] = value.y;
            arrayView[2] = value.z;
        }
        else if (value instanceof vec2) {
            var arrayView = new Float32Array(array, position, 2);
            arrayView[0] = value.x;
            arrayView[1] = value.y;
        }
        else {
            throw new Error();
        }
    }
    CV.putInArray = putInArray;
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
    function run(state) {
        var oldTimeMs = Date.now();
        function frame() {
            CV.stats.frames++;
            var nowTimeMs = Date.now();
            var deltaTimeMs = nowTimeMs - oldTimeMs;
            var deltaTime = deltaTimeMs / 1000;
            oldTimeMs = nowTimeMs;
            var width = CV.canvas.offsetWidth;
            var height = CV.canvas.offsetHeight;
            CV.canvas.width = width;
            CV.canvas.height = height;
            CV.gl.viewport(0, 0, width, height);
            CV.stats.begin("update");
            state.update(deltaTime);
            CV.stats.end();
            CV.stats.begin("render");
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
var CV;
(function (CV) {
    CV.FLOAT_ATTRIBUTE_TYPE = { sizeof: CV.SIZEOF_FLOAT, size: 1, type: CV.gl.FLOAT };
    CV.VEC2_ATTRIBUTE_TYPE = { sizeof: CV.SIZEOF_FLOAT * 2, size: 2, type: CV.gl.FLOAT };
    CV.VEC3_ATTRIBUTE_TYPE = { sizeof: CV.SIZEOF_FLOAT * 3, size: 3, type: CV.gl.FLOAT };
    CV.VEC4_ATTRIBUTE_TYPE = { sizeof: CV.SIZEOF_FLOAT * 4, size: 4, type: CV.gl.FLOAT };
    function getAttributeType(value) {
        if (typeof value === "number") {
            return CV.FLOAT_ATTRIBUTE_TYPE;
        }
        else if (value instanceof vec4) {
            return CV.VEC4_ATTRIBUTE_TYPE;
        }
        else if (value instanceof vec3) {
            return CV.VEC3_ATTRIBUTE_TYPE;
        }
        else if (value instanceof vec2) {
            return CV.VEC2_ATTRIBUTE_TYPE;
        }
        else {
            throw new Error();
        }
    }
    CV.getAttributeType = getAttributeType;
    function compileShader(type, source) {
        var shader = CV.gl.createShader(type);
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
            CV.gl.attachShader(this.program, compileShader(CV.gl.FRAGMENT_SHADER, "precision mediump float;\n" + fragmentSource));
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
                if (uniform instanceof Number) {
                    CV.gl.uniform1f(location_1, uniform);
                }
                else if (uniform instanceof vec4) {
                    CV.gl.uniform4f(location_1, uniform.x, uniform.y, uniform.z, uniform.w);
                }
                else if (uniform instanceof vec3) {
                    CV.gl.uniform3f(location_1, uniform.x, uniform.y, uniform.z);
                }
                else if (uniform instanceof vec2) {
                    CV.gl.uniform2f(location_1, uniform.x, uniform.y);
                }
            }
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
            var dragOffset;
            function mouseDown(e) {
                if (e.button == 0) {
                    dragOffset = [e.offsetX, e.offsetY];
                    window.addEventListener("mousemove", mouseMove, true);
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
            function mouseMove(e) {
                domElement.style.left = (e.pageX - dragOffset[0]) + "px";
                domElement.style.top = (e.pageY - dragOffset[1]) + "px";
                e.preventDefault();
                e.stopPropagation();
            }
            function mouseUp(e) {
                if (dragOffset) {
                    window.removeEventListener("mousemove", mouseMove, true);
                    e.preventDefault();
                    e.stopPropagation();
                    dragOffset = undefined;
                }
            }
            title.addEventListener("mousedown", mouseDown, false);
            title.addEventListener("mouseup", mouseUp, false);
            this.domElement = domElement;
        }
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
            container.appendChild(this.watchesElement);
            this.context = this.canvas.getContext("2d");
            this.data = [];
            this.lastUpdate = Date.now();
            this.watches = {};
        }
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
    window.addEventListener("load", function () {
        document.body.appendChild(CV.stats.domElement);
        setInterval(function () {
            CV.stats.update();
        }, 1000);
    });
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
                        var type = CV.getAttributeType(particle[name_4]);
                        this.attributes[name_4] = { type: type, offset: this.sizeofT };
                        this.sizeofT += type.sizeof;
                    }
                }
                this.data = new ArrayBuffer(Math.ceil(this.sizeofT * this.particles.length * 1.5));
            }
            for (var i = 0; i < this.particles.length; i++) {
                var particle = this.particles[i];
                for (var name_5 in this.attributes) {
                    CV.putInArray(particle[name_5], this.data, this.sizeofT * i + this.attributes[name_5].offset);
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
if (!GLSL) {
    var GLSL = {};
}
GLSL["shader/test-particle/vertex.glsl"] = "attribute vec2 attr_position;\nattribute float attr_size;\nvoid main() {\n    gl_Position = vec4(attr_position, 0.0, 1.0);\n    gl_PointSize = attr_size;\n}";
if (!GLSL) {
    var GLSL = {};
}
GLSL["shader/test-particle/fragment.glsl"] = "void main() {\n    gl_FragColor = vec4(gl_PointCoord.xy, 0.0, 1.0);\n}";
var gradientShader = new CV.Shader(GLSL["shader/gradient/vertex.glsl"], GLSL["shader/gradient/fragment.glsl"]);
var particleShader = new CV.Shader(GLSL["shader/test-particle/vertex.glsl"], GLSL["shader/test-particle/fragment.glsl"]);
var buffer = CV.gl.createBuffer();
CV.gl.bindBuffer(CV.gl.ARRAY_BUFFER, buffer);
CV.gl.bufferData(CV.gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), CV.gl.STATIC_DRAW);
function random(a, b) {
    return a + Math.random() * (b - a);
}
var Particle = (function (_super) {
    __extends(Particle, _super);
    function Particle() {
        _super.apply(this, arguments);
        this.position = new vec2(0, 0);
        this.size = random(5, 50);
        this.velocity = new vec2(random(-0.3, 0.3), random(0.5, 1.3));
    }
    return Particle;
}(CV.Particle));
var P2 = (function (_super) {
    __extends(P2, _super);
    function P2() {
        _super.apply(this, arguments);
    }
    return P2;
}(CV.Particle));
var Test = (function () {
    function Test() {
        this.currentTime = 0;
        this.particleSystem = new CV.ParticleSystem(particleShader);
        this.nextParticle = 0;
        this.G = new vec2(0, -1);
    }
    Test.prototype.update = function (deltaTime) {
        this.currentTime += deltaTime;
        for (var _i = 0, _a = this.particleSystem.particles; _i < _a.length; _i++) {
            var particle = _a[_i];
            particle.position = vec2.add(particle.position, vec2.mul(particle.velocity, deltaTime));
            particle.velocity = vec2.add(particle.velocity, vec2.mul(this.G, deltaTime));
        }
        this.particleSystem.particles = this.particleSystem.particles.filter(function (p) { return p.position.y > -0.5; });
        this.nextParticle -= deltaTime;
        while (this.nextParticle < 0) {
            this.particleSystem.particles.push(new Particle());
            this.nextParticle += 5e-4;
        }
        CV.stats.watch("particles", this.particleSystem.particles.length);
    };
    Test.prototype.render = function () {
        CV.gl.clearColor(0, 0, 0, 1);
        CV.gl.clear(CV.gl.COLOR_BUFFER_BIT);
        gradientShader.use();
        CV.gl.bindBuffer(CV.gl.ARRAY_BUFFER, buffer);
        var loc = gradientShader.attribLocation("position");
        CV.gl.enableVertexAttribArray(loc);
        CV.gl.vertexAttribPointer(loc, 2, CV.gl.FLOAT, false, 8, 0);
        CV.gl.uniform4f(gradientShader.uniformLocation("colorIn"), 1, 1, 1, 1);
        var out = Math.sin(this.currentTime);
        CV.gl.uniform4f(gradientShader.uniformLocation("colorOut"), out, out, out, 1);
        CV.gl.drawArrays(CV.gl.TRIANGLE_FAN, 0, 4);
        this.particleSystem.render();
    };
    return Test;
}());
CV.resources.onLoaded.subscribe(function () {
    var codevisual = document.getElementById("codevisual");
    codevisual.appendChild(CV.canvas);
    CV.run(new Test());
});
//# sourceMappingURL=CodeVisual.js.map