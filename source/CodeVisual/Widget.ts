///<reference path="__package__.ts"/>

namespace CV {

    export class Widget {
        domElement: Node;

        constructor(name: string, content: Node) {
            const title = document.createElement("div");
            title.className = "codevisual-widget__title";
            title.innerText = name;
            const contentElement = document.createElement("div");
            contentElement.className = "codevisual-widget__content";
            contentElement.appendChild(content);
            const domElement = document.createElement("div");
            domElement.className = "codevisual-widget";
            domElement.appendChild(title);
            domElement.appendChild(contentElement);
            this.domElement = domElement;
        }
    }
}