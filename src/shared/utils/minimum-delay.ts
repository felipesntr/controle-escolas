const LIST_LOADING_MS = 800;

export function waitForListLoading(startedAt: number) {
    const remaining = LIST_LOADING_MS - (Date.now() - startedAt);

    if (remaining <= 0) {
        return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
        setTimeout(resolve, remaining);
    });
}
