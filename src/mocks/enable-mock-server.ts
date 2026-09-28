let started = false;

export async function enableMockServer() {
    if (!__DEV__) {
        return;
    }

    if (started) {
        return;
    }

    await import("../../msw.polyfills");

    const { server } = await import("./server");

    if (server == null) {
        throw new Error("Não foi possível iniciar o servidor de mocks.");
    }

    server.listen({
        onUnhandledRequest(request, print) {
            const { pathname } = new URL(request.url);

            if (pathname === "/symbolicate") {
                return;
            }

            print.warning();
        },
    });

    started = true;
}