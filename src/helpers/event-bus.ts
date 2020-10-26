export class EventBus {
    private listeners: Record<string, Function[]> = {};

    on(event: string, callback: Function): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(callback);
    }

    off(event: string, callback: Function): void | never {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }

        this.listeners[event] = this.listeners[event].filter((listener: () => void) => listener !== callback);
    }

    emit(event: string, ...args: any[]): void | never {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }

        this.listeners[event].forEach(function (listener: Function) {
            listener(...args);
        });
    }
}
