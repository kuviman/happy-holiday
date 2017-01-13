class LiteEvent {
    private handlers: (() => void)[] = [];

    subscribe(handler: () => void) {
        this.handlers.push(handler);
    }

    fire() {
        for (let handler of this.handlers) {
            handler();
        }
    }
}

class LiteEvent1<T> {
    private handlers: ((arg: T) => void)[] = [];

    subscribe(handler: (arg: T) => void) {
        this.handlers.push(handler);
    }

    fire(arg: T) {
        for (let handler of this.handlers) {
            handler(arg);
        }
    }
}