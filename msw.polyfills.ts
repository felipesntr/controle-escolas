import "fast-text-encoding";
import "react-native-url-polyfill/auto";

const globalScope = globalThis as typeof globalThis;
const listeners = new WeakMap<object, Map<string, Set<EventListener>>>();

function hasGlobal(name: string) {
  return name in globalThis;
}

if (!hasGlobal("Event")) {
  globalScope.Event = class Event {
    type: string;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented = false;

    constructor(type: string, eventInitDict?: EventInit) {
      this.type = type;
      this.bubbles = eventInitDict?.bubbles ?? false;
      this.cancelable = eventInitDict?.cancelable ?? false;
    }

    preventDefault() {
      if (this.cancelable) {
        this.defaultPrevented = true;
      }
    }

    stopPropagation() {}

    stopImmediatePropagation() {}
  } as typeof Event;
}

if (!hasGlobal("EventTarget")) {
  globalScope.EventTarget = class EventTarget {
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject | null,
    ) {
      if (typeof listener !== "function") {
        return;
      }

      const targetListeners =
        listeners.get(this) ?? new Map<string, Set<EventListener>>();
      const typeListeners = targetListeners.get(type) ?? new Set<EventListener>();

      typeListeners.add(listener);
      targetListeners.set(type, typeListeners);
      listeners.set(this, targetListeners);
    }

    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject | null,
    ) {
      if (typeof listener !== "function") {
        return;
      }

      listeners.get(this)?.get(type)?.delete(listener);
    }

    dispatchEvent(event: Event) {
      listeners
        .get(this)
        ?.get(event.type)
        ?.forEach((listener) => {
          listener.call(this, event);
        });

      return !event.defaultPrevented;
    }
  };
}

if (!hasGlobal("MessageEvent")) {
  globalScope.MessageEvent = class MessageEvent extends Event {
    data: unknown;
    origin: string;
    lastEventId: string;
    source: MessageEventSource | null;
    ports: readonly MessagePort[];

    constructor(type: string, eventInitDict?: MessageEventInit) {
      super(type, eventInitDict);
      this.data = eventInitDict?.data ?? null;
      this.origin = eventInitDict?.origin ?? "";
      this.lastEventId = eventInitDict?.lastEventId ?? "";
      this.source = eventInitDict?.source ?? null;
      this.ports = eventInitDict?.ports ?? [];
    }
  } as unknown as typeof MessageEvent;
}

if (!hasGlobal("BroadcastChannel")) {
  globalScope.BroadcastChannel = class BroadcastChannel extends EventTarget {
    name: string;
    onmessage: ((this: BroadcastChannel, ev: MessageEvent) => void) | null =
      null;
    onmessageerror:
      | ((this: BroadcastChannel, ev: MessageEvent) => void)
      | null = null;

    constructor(name: string) {
      super();
      this.name = name;
    }

    postMessage(_message: unknown) {}

    close() {}
  } as unknown as typeof BroadcastChannel;
}

if (Object.getOwnPropertyDescriptor(Response.prototype, "body") == null) {
  Object.defineProperty(Response.prototype, "body", {
    configurable: true,
    enumerable: true,
    get(this: Response & { _bodyInit?: BodyInit | null }) {
      const body = this._bodyInit;

      if (typeof body === "string" || (typeof Blob !== "undefined" && body instanceof Blob)) {
        return body;
      }

      return null;
    },
  });
}

if (!hasGlobal("crypto")) {
  globalScope.crypto = {
    randomUUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        (character) => {
          const random = Math.floor(Math.random() * 16);
          const value = character === "x" ? random : (random & 0x3) | 0x8;
          return value.toString(16);
        },
      );
    },
  } as Crypto;
}
