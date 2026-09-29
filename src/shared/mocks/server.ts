import { createServer, type Server } from "miragejs";

import { API_URL } from "@/shared/constants/api";

export function createMockServer(registerRoutes: (server: Server) => void) {
    return createServer({
        environment: "development",
        urlPrefix: API_URL,
        timing: 0,
        logging: false,
        useDefaultPassthroughs: false,
        routes() {
            this.namespace = "";
            this.passthrough((request) => !request.url.startsWith(API_URL));
            registerRoutes(this);
        },
    });
}
