///<reference path="__package__.ts"/>

namespace CV {

    export class Widget {
        domElement: Node;
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

            let dragOffset: [number, number];

            function mouseDown(e: MouseEvent) {
                if (e.button == 0) {
                    dragOffset = [e.offsetX, e.offsetY];
                    window.addEventListener("mousemove", mouseMove, true);
                    e.preventDefault();
                    e.stopPropagation();
                }
            }

            function mouseMove(e: MouseEvent) {
                domElement.style.left = (e.pageX - dragOffset[0]) + "px";
                domElement.style.top = (e.pageY - dragOffset[1]) + "px";
                e.preventDefault();
                e.stopPropagation();
            }

            function mouseUp(e: MouseEvent) {
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

        set title(value: string) {
            this.titleElement.innerText = value;
        }
    }
}