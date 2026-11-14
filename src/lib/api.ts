import { createClient } from "fulgur/client";
import type { App } from "../route.server";

export const api = createClient<App>();
