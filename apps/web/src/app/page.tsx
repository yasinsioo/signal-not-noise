import Link from "next/link";
import { listDecisions } from "@/lib/api";

export default async function Home() {
  const items = await listDecisions().catch(() => []);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Decisions</h1>
        <Link
          href="/new"
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
        >
          New decision
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 text-sm text-gray-600">
          No decisions yet. Create your first one.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((d) => (
            <li key={d.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{d.title}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {d.createdAt}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {d.tags.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border px-2 py-0.5 text-xs text-gray-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
