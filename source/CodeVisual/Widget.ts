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
            this.domElement = domElement;
        }

        set title(value: string) {
            this.titleElement.innerText = value;
        }
    }
}