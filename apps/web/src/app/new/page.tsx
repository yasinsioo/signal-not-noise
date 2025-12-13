"use client";

import { useState } from "react";
import { createDecision } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewDecisionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [decision, setDecision] = useState("");
  const [consequences, setConsequences] = useState("");
  const [tagsText, setTagsText] = useState("aws,serverless,ai");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const tags = tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await createDecision({ title, context, decision, consequences, tags });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New decision</h1>
        <Link href="/" className="text-sm underline">
          Back
        </Link>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field label="Title">
          <input
            className="w-full rounded-md border px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Field>

        <Field label="Context (why?)">
          <textarea
            className="w-full rounded-md border px-3 py-2"
            rows={4}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            required
          />
        </Field>

        <Field label="Decision (what?)">
          <textarea
            className="w-full rounded-md border px-3 py-2"
            rows={4}
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            required
          />
        </Field>

        <Field label="Consequences (trade-offs)">
          <textarea
            className="w-full rounded-md border px-3 py-2"
            rows={4}
            value={consequences}
            onChange={(e) => setConsequences(e.target.value)}
            required
          />
        </Field>

        <Field label="Tags (comma-separated)">
          <input
            className="w-full rounded-md border px-3 py-2"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />
        </Field>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          disabled={loading}
          className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium">{label}</div>
      {children}
    </label>
  );
}
