import type { Server } from "miragejs";

import { createMockServer } from "./server";

let server: Server | null = null;

function ensureCrypto() {
    if (typeof globalThis.crypto?.randomUUID === "function") {
        return;
    }

    Object.defineProperty(globalThis, "crypto", {
        configurable: true,
        value: {
            randomUUID() {
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                    /[xy]/g,
                    (character) => {
                        const random = Math.floor(Math.random() * 16);
                        const value = character === "x" ? random : (random & 0x3) | 0x8;
                        return value.toString(16);
                    }
                );
            },
        },
    });
}

export function enableMockServer(registerRoutes: (server: Server) => void) {
    if (!__DEV__) {
        return Promise.resolve();
    }

    ensureCrypto();

    if (server) {
        server.shutdown();
    }

    server = createMockServer(registerRoutes);

    return Promise.resolve();
}
