import { Hono } from "hono";

export const app = new Hono();

//cors

app.use("*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", "http://localhost:3000");
  c.header("Access-Control-Allow-Methods", "GET, POST,OPTIONS");
  c.header("Access-Control-Allow-Headers", "content-type");
  if (c.req.method === "OPTIONS") return c.body(null, 204);
  await next();
});

//decision model

type Decision = {
  id: string;
  title: string;
  context: string;
  decision: string;
  consequences: string;
  tags: string[];
  createdAt: string;
};

const store: Decision[] = [];

app.get("/decisions", (c) => {
  const items = [...store].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return c.json({ items });
});

app.post("/decisions", async (c) => {
  const body = await c.req.json().catch(() => null);

  if (
    !body ||
    typeof body.title !== "string" ||
    typeof body.context !== "string" ||
    typeof body.decision !== "string" ||
    typeof body.consequences !== "string" ||
    !Array.isArray(body.tags)
  ) {
    return c.json({ error: "Invalid input" }, 400);
  }

  const now = new Date().toISOString();
  const item: Decision = {
    id: crypto.randomUUID(),
    title: body.title.trim(),
    context: body.context.trim(),
    decision: body.decision.trim(),
    consequences: body.consequences.trim(),
    tags: body.tags.map((t: unknown) => String(t).trim()).filter(Boolean),
    createdAt: now,
  };

  store.push(item);

  return c.json(item, 201);
});

// Basit health endpoint
app.get("/health", (c) => c.json({ ok: true, service: "api" }));
