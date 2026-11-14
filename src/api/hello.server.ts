import { Elysia } from "fulgur/server";

export const helloRoutes = new Elysia().get("/hello", () => ({
  message: "Hello World!",
}));
