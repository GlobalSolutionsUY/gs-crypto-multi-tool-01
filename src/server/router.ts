/**
 * Central API Request Router (TypeScript + Hono)
 */

import { getRequestListener } from "@hono/node-server";
import { app } from "./app";

export const handleApiRequest = getRequestListener(app.fetch);
export { app };
