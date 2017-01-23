///<reference path="__package__.ts"/>

namespace CV {
    export interface Setting<T> {
        readonly name: string;
        readonly onChange: LiteEvent1<T>;
        value: T;
        readonly inputElement: Node;
    }

    export class RangeSetting implements Setting<number> {
        readonly inputElement: HTMLInputElement = document.createElement("input");
        readonly onChange: LiteEvent1<number> = new LiteEvent1<number>();

        constructor(readonly name: string,
                    readonly min: number,
                    readonly max: number,
                    readonly step: number = 1) {
            this.inputElement.type = "range";
            this.inputElement.min = min.toString();
            this.inputElement.max = max.toString();
            this.inputElement.step = step.toString();
            this.inputElement.addEventListener("change", () => this.onChange.fire(this.value));
        }

        get value(): number {
            return parseFloat(this.inputElement.value);
        }

        set value(x: number) {
            this.inputElement.value = x.toString();
        }
    }

    export class Settings extends Widget {
        private table: HTMLTableElement;

        constructor() {
            const table = document.createElement("table");
            super("Settings", table);
            this.table = table;
            window.addEventListener("load", () => {
                document.body.appendChild(this.domElement);
            });
        }

        add<T>(setting: Setting<T>) {
            const row = document.createElement("tr");
            const nameTD = document.createElement("td");
            nameTD.innerText = setting.name;
            const inputTD = document.createElement("td");
            inputTD.appendChild(setting.inputElement);
            row.appendChild(nameTD);
            row.appendChild(inputTD);
            this.table.appendChild(row);
        }
    }

    export const settings: Settings = new Settings();
}