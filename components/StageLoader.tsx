import { CheckCircle2, Circle, Loader2 } from "lucide-react";

const steps = ["正在结构化你的描述", "分析行为根因", "生成 6 周训练计划"];

export function StageLoader({ activeStep }: { activeStep: number }) {
  return (
    <section className="animate-fade-in rounded-lg border border-black/10 bg-white p-6 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-moss">三段式 AI 工作流</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">AI 正在把描述拆成可执行训练计划</h2>

      <div className="mt-6 space-y-3">
        {steps.map((step, index) => {
          const done = index < activeStep;
          const current = index === activeStep;

          return (
            <div key={step} className="flex items-center gap-3 rounded-lg border border-black/10 bg-paper px-4 py-3">
              {done ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-moss" aria-hidden="true" />
              ) : current ? (
                <Loader2 className="h-5 w-5 shrink-0 animate-spin text-amberline" aria-hidden="true" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-ink/30" aria-hidden="true" />
              )}
              <span className={current ? "font-semibold text-ink" : "text-ink/70"}>{step}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4">
        <div className="rounded-lg border border-black/10 p-4">
          <div className="h-4 w-32 animate-pulse rounded bg-ink/10" />
          <div className="mt-4 h-3 w-4/5 animate-pulse rounded bg-ink/10" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-ink/10" />
        </div>
        <div className="rounded-lg border border-black/10 p-4">
          <div className="h-4 w-40 animate-pulse rounded bg-ink/10" />
          <div className="mt-4 grid gap-2">
            <div className="h-12 animate-pulse rounded bg-ink/10" />
            <div className="h-12 animate-pulse rounded bg-ink/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
