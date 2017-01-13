///<reference path="__package__.ts"/>

namespace CV {
    export abstract class Resource {
        loaded: boolean = false;
        onLoaded: LiteEvent = new LiteEvent();

        constructor(public name: string) {
            resources.queue(this);
        }

        confirmLoaded() {
            this.loaded = true;
            this.onLoaded.fire();
        }

        abstract load(): void;
    }

    export class FakeResource extends Resource {
        constructor(name: string) {
            super(name);
        }

        load(): void {
        }
    }

    class ResourceManager {
        private buffer: Resource[] = [];
        private currentlyLoadingNonFake: number = 0;
        private currentlyLoading: Resource[] = [];

        private _totalCount: number = 0;
        get totalCount(): number {
            return this._totalCount;
        }

        private _loadedCount: number = 0;
        get loadedCount(): number {
            return this._loadedCount;
        }

        readonly onLoaded: LiteEvent = new LiteEvent();

        constructor(public simultaneousCount: number) {
        }

        queue(resource: Resource) {
            this._totalCount++;
            if (resource instanceof FakeResource) {
                this.startLoad(resource);
            } else {
                this.buffer.push(resource);
                this.tryLoadMore();
            }
        }

        private startLoad(resource: Resource) {
            console.log("Started: " + resource.name);
            this.currentlyLoading.push(resource);
            resource.onLoaded.subscribe(() => {
                console.log("Finished: " + resource.name);
                this.currentlyLoading.splice(this.currentlyLoading.indexOf(resource));
                if (!(resource instanceof FakeResource)) {
                    this.currentlyLoadingNonFake--;
                }
                this._loadedCount++;
                this.tryLoadMore();
            });
            if (!(resource instanceof FakeResource)) {
                this.currentlyLoadingNonFake++;
            }
            resource.load();
        }

        private tryLoadMore() {
            while (this.buffer.length != 0 && this.currentlyLoadingNonFake < this.simultaneousCount) {
                this.startLoad(this.buffer.shift());
            }
            if (this._loadedCount == this._totalCount) {
                setTimeout(() => this.onLoaded.fire(), 0);
            }
        }
    }
    export const resources: ResourceManager = new ResourceManager(1);

    export class CombinedResource extends FakeResource {
        constructor(name: string, ...parts: Resource[]) {
            super(name);
            let resourcesLeft: number = parts.length;
            for (let part of parts) {
                part.onLoaded.subscribe(() => {
                    resourcesLeft--;
                    if (resourcesLeft == 0) {
                        this.confirmLoaded();
                    }
                });
            }
        }
    }

    export function loadText(url: string, callback: (text: string) => void): Resource {
        return new class extends Resource {
            constructor() {
                super(url);
            }

            load(): void {
                const request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.onload = () => {
                    callback(request.responseText);
                    this.confirmLoaded();
                };
                request.send();
            }
        }();
    }

    const windowResource = new FakeResource("window.onload");
    window.onload = () => windowResource.confirmLoaded(); // TODO: append
}