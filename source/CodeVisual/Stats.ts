///<reference path="__package__.ts"/>

namespace CV {
    class StatsData {
        timeConsumed: number = 0;
        private beginTime: number;
        children: {[name: string]: StatsData} = {};
        assignedColor: number;

        constructor(public name: string) {
        }

        begin() {
            this.beginTime = Date.now();
        }

        end() {
            this.timeConsumed += Date.now() - this.beginTime;
        }

        subData(name: string): StatsData {
            let result = this.children[name];
            if (!result) {
                result = this.children[name] = new StatsData(name);
            }
            return result;
        }
    }

    export class Stats extends Widget {
        canvas: HTMLCanvasElement;
        private context: CanvasRenderingContext2D;
        private legend: HTMLOListElement;
        private watchesElement: HTMLUListElement;

        constructor() {
            const container = document.createElement("div");
            const canvas = document.createElement("canvas");
            canvas.width = 100;
            canvas.height = 100;
            super("Stats", container);
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
            window.addEventListener("load", () => {
                document.body.appendChild(this.domElement);
            });
            this.disabled = false;
        }

        private _disabled: boolean;

        set disabled(value: boolean) {
            this._disabled = value;
            if (!value) {
                setTimeout(() => {
                    this.update();
                });
            }
        }

        get disabled() {
            return this._disabled;
        }

        data: StatsData[];
        frames: number;

        begin(name: string) {
            if (this.data.length == 0) {
                this.data.push(new StatsData("root"));
            }
            const neededData = this.data[this.data.length - 1].subData(name);
            neededData.begin();
            this.data.push(neededData);
        }

        end() {
            this.data.pop().end();
        }

        private lastUpdate: number;

        update() {
            if (!this.disabled) {
                setTimeout(() => {
                    this.update();
                }, 1000);
            }
            if (this.data.length == 0) {
                return;
            }
            const nowTime = Date.now();
            this.colorIndex = -1;
            const root = this.data[0];
            const timeElapsed = nowTime - this.lastUpdate;
            root.timeConsumed = 0;
            for (let name in root.children) {
                root.timeConsumed += root.children[name].timeConsumed;
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
            this.allData.sort((a, b) => b.timeConsumed - a.timeConsumed);
            let index = 0;
            for (let data of this.allData) {
                const description = document.createElement("li");
                description.style.color = CHART_COLORS[data.assignedColor];
                description.innerText = data.name + ": "
                    + data.timeConsumed + "ms"
                    + " (" + Math.round(100 * data.timeConsumed / this.data[0].timeConsumed) + "%)";
                this.legend.appendChild(description);
            }
            this.lastUpdate = nowTime;
            this.data = [];
            this.frames = 0;
        }

        private allData: StatsData[];
        private colorIndex: number;

        private render(data: StatsData, radius: number, angleFrom: number, angleTo: number) {
            if (this.colorIndex >= 0) {
                this.context.save();
                const centerX = Math.floor(this.canvas.width / 2);
                const centerY = Math.floor(this.canvas.height / 2);
                const realRadius = Math.floor(Math.min(this.canvas.width, this.canvas.height) / 2) * radius;

                this.context.beginPath();
                this.context.moveTo(centerX, centerY);
                this.context.arc(centerX, centerY, realRadius,
                    angleFrom, angleTo, false);
                this.context.closePath();

                this.context.fillStyle = CHART_COLORS[this.colorIndex];
                this.context.fill();

                this.context.restore();

                data.assignedColor = this.colorIndex;
                this.allData.push(data);
            }
            this.colorIndex++;
            let currentAngle = angleFrom;
            for (let name in data.children) {
                const child = data.children[name];
                let span = (angleTo - angleFrom) * child.timeConsumed / data.timeConsumed;
                this.render(child, radius * 0.8, currentAngle, currentAngle + span);
                currentAngle += span;
            }
        }

        watches: {[name: string]: HTMLLIElement};

        watch(name: string, value: any) {
            if (!this.watches[name]) {
                this.watches[name] = document.createElement("li");
                this.watchesElement.appendChild(this.watches[name]);
            }
            this.watches[name].innerText = name + ": " + value;
        }
    }

    export const stats: Stats = new Stats();
}