const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8787";

export type Decision = {
  id: string;
  title: string;
  context: string;
  decision: string;
  consequences: string;
  tags: string[];
  createdAt: string;
};

export async function listDecisions(): Promise<Decision[]> {
  const res = await fetch(`${API_BASE}/decisions`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch decisions`);
  const data = await res.json();
  return data.items ?? [];
}

export async function createDecision(
  input: Omit<Decision, "id" | "createdAt">
) {
  const res = await fetch(`${API_BASE}/decisions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");

    throw new Error(msg || `Failed to create decision`);
  }

  return res.json();
}
