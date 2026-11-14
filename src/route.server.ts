import { Elysia } from "fulgur/server";

import { helloRoutes } from "./api/hello.server";

const app = new Elysia().use(helloRoutes);

export default app;
export type App = typeof app;
