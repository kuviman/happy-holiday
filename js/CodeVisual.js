var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            var nowTimeMs = Date.now();
            var deltaTimeMs = nowTimeMs - oldTimeMs;
            var deltaTime = deltaTimeMs / 1000;
            oldTimeMs = nowTimeMs;
            var width = CV.canvas.offsetWidth;
            var height = CV.canvas.offsetHeight;
            CV.canvas.width = width;
            CV.canvas.height = height;
            CV.gl.viewport(0, 0, width, height);
            state.update(deltaTime);
            state.render();
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
                setTimeout(function () { return _this.onLoaded.fire(); }, 0);
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
    var windowResource = new FakeResource("window.onload");
    window.onload = function () { return windowResource.confirmLoaded(); };
})(CV || (CV = {}));
var CV;
(function (CV) {
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
            result = CV.gl.getAttribLocation(this.program, name);
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
    var element = document.createElement("div");
})(CV || (CV = {}));
var gradientShader;
CV.Shader.load("shader/gradient", function (shader) {
    gradientShader = shader;
});
var buffer = CV.gl.createBuffer();
CV.gl.bindBuffer(CV.gl.ARRAY_BUFFER, buffer);
CV.gl.bufferData(CV.gl.ARRAY_BUFFER, Float32Array.of(-1, -1, -1, 1, 1, 1, 1, -1), CV.gl.STATIC_DRAW);
var Test = (function () {
    function Test() {
        this.currentTime = 0;
    }
    Test.prototype.update = function (deltaTime) {
        this.currentTime += deltaTime;
    };
    Test.prototype.render = function () {
        CV.gl.clearColor(0, 0, 0, 1);
        CV.gl.clear(CV.gl.COLOR_BUFFER_BIT);
        gradientShader.use();
        CV.gl.bindBuffer(CV.gl.ARRAY_BUFFER, buffer);
        var loc = gradientShader.attribLocation("attr_position");
        CV.gl.enableVertexAttribArray(loc);
        CV.gl.vertexAttribPointer(loc, 2, CV.gl.FLOAT, false, 8, 0);
        CV.gl.uniform4f(gradientShader.uniformLocation("colorIn"), 1, 1, 1, 1);
        var out = Math.sin(this.currentTime);
        CV.gl.uniform4f(gradientShader.uniformLocation("colorOut"), out, out, out, 1);
        CV.gl.drawArrays(CV.gl.TRIANGLE_FAN, 0, 4);
    };
    return Test;
}());
CV.resources.onLoaded.subscribe(function () {
    var codevisual = document.getElementById("codevisual");
    codevisual.appendChild(CV.canvas);
    CV.run(new Test());
});
//# sourceMappingURL=CodeVisual.js.map