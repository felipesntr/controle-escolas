import type { RequestHandler } from "msw";

let startPromise: Promise<void> | null = null;

function isAlreadyEnabled(error: unknown) {
    return (
        error instanceof Error &&
        error.message.includes("already enabled")
    );
}

export function enableMockServer(handlers: RequestHandler[]) {
    if (!__DEV__) {
        return Promise.resolve();
    }

    if (!startPromise) {
        startPromise = startMockServer(handlers).catch((error: unknown) => {
            startPromise = null;
            throw error;
        });
    }

    return startPromise;
}

async function startMockServer(handlers: RequestHandler[]) {
    await import("../../../msw.polyfills");

    const { createMockServer } = await import("./server");
    const server = createMockServer(handlers);

    if (server == null) {
        throw new Error("Não foi possível iniciar o servidor de mocks.");
    }

    const options = {
        onUnhandledRequest(request: Request, print: { warning: () => void }) {
            const { pathname } = new URL(request.url);

            if (pathname === "/symbolicate") {
                return;
            }

            print.warning();
        },
    };

    try {
        server.listen(options);
    } catch (error) {
        if (!isAlreadyEnabled(error)) {
            throw error;
        }

        server.close();
        server.listen(options);
    }
}