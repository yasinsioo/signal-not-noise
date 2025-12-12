import { Hono } from "hono";

export const app = new Hono();

// Basit health endpoint
app.get("/health", (c) => c.json({ ok: true, service: "api" }));
