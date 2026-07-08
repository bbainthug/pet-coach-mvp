import { ShieldAlert } from "lucide-react";

export function RedLineAlert({ redLines }: { redLines: string[] }) {
  return (
    <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-950">
      <div className="mb-3 flex items-center gap-2">
        <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        <h3 className="text-base font-semibold">何时该找专业人士</h3>
      </div>
      <ul className="space-y-2 text-sm leading-6">
        {redLines.map((line) => (
          <li key={line} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
