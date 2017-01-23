///<reference path="__package__.ts"/>

namespace CV {

    export class Widget {
        domElement: HTMLElement;
        private titleElement: HTMLDivElement;

        constructor(name: string, content: Node) {
            const title = document.createElement("div");
            title.className = "codevisual-widget__title";
            title.innerText = name;
            this.titleElement = title;
            const contentElement = document.createElement("div");
            contentElement.className = "codevisual-widget__content";
            contentElement.appendChild(content);
            const domElement = document.createElement("div");
            domElement.className = "codevisual-widget";
            domElement.appendChild(title);
            domElement.appendChild(contentElement);

            this.domElement = domElement;

            this.setupMouseDragging();
            this.setupTouchDragging();
        }

        private setupMouseDragging() {
            let dragOffset: [number, number];

            let mouseMove = (e: MouseEvent) => {
                this.domElement.style.left = (e.clientX - dragOffset[0]) + "px";
                this.domElement.style.top = (e.clientY - dragOffset[1]) + "px";
                e.preventDefault();
                e.stopPropagation();
            };

            let mouseDown = (e: MouseEvent) => {
                if (e.button == 0) {
                    dragOffset = [e.clientX - this.domElement.offsetLeft,
                        e.clientY - this.domElement.offsetTop];
                    window.addEventListener("mousemove", mouseMove, true);
                    e.preventDefault();
                    e.stopPropagation();
                }
            }

            function mouseUp(e: MouseEvent) {
                if (dragOffset) {
                    window.removeEventListener("mousemove", mouseMove, true);
                    e.preventDefault();
                    e.stopPropagation();
                    dragOffset = undefined;
                }
            }

            this.titleElement.addEventListener("mousedown", mouseDown, false);
            this.titleElement.addEventListener("mouseup", mouseUp, false);
        }

        private setupTouchDragging() {
            let dragOffset: [number, number];

            let touchMove = (e: TouchEvent) => {
                this.domElement.style.left = (e.touches[0].clientX - dragOffset[0]) + "px";
                this.domElement.style.top = (e.touches[0].clientY - dragOffset[1]) + "px";
                e.preventDefault();
                e.stopPropagation();
            };

            let touchDown = (e: TouchEvent) => {
                if (e.touches.length == 1) {
                    dragOffset = [e.touches[0].clientX - this.domElement.offsetLeft,
                        e.touches[0].clientY - this.domElement.offsetTop];
                    window.addEventListener("touchmove", touchMove, true);
                    e.preventDefault();
                    e.stopPropagation();
                }
            }

            function touchUp(e: TouchEvent) {
                if (dragOffset) {
                    window.removeEventListener("mousemove", touchMove, true);
                    e.preventDefault();
                    e.stopPropagation();
                    dragOffset = undefined;
                }
            }

            this.titleElement.addEventListener("touchstart", touchDown, false);
            this.titleElement.addEventListener("touchend", touchUp, false);
        }

        set title(value: string) {
            this.titleElement.innerText = value;
        }
    }
}