///<reference path="__package__.ts"/>

namespace CV {
    class StatsData {
        timeConsumed: number = 0;
        private beginTime: number;
        children: {[name: string]: StatsData} = {};

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

        constructor() {
            const canvas = document.createElement("canvas");
            canvas.width = 100;
            canvas.height = 100;
            super("Stats", canvas);
            this.canvas = canvas;
            this.context = this.canvas.getContext("2d");
            this.data = [];
            this.lastUpdate = Date.now();
        }

        data: StatsData[];

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
            if (this.data.length == 0) {
                return;
            }
            const nowTime = Date.now();
            this.colorIndex = -1;
            const root = this.data[0];
            // root.timeConsumed = nowTime - this.lastUpdate;
            root.timeConsumed = 0;
            for (let name in root.children) {
                root.timeConsumed += root.children[name].timeConsumed;
            }
            if (root.timeConsumed == 0) {
                return;
            }
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.render(root, 1, 0, 2 * Math.PI);
            this.lastUpdate = nowTime;
            this.data = [];
        }

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
    }

    export const stats: Stats = new Stats();
    window.addEventListener("load", () => {
        document.body.appendChild(stats.domElement);
        setInterval(() => {
            stats.update();
        }, 100);
    });
}