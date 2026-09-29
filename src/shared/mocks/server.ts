import "../../../msw.polyfills";
import type { RequestHandler } from "msw";
import { setupServer } from "msw/native";

export function createMockServer(handlers: RequestHandler[]) {
    return setupServer(...handlers);
}
