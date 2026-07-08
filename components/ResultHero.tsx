import { Sparkles } from "lucide-react";
import { severityLabels } from "@/lib/severity";
import type { Stage2Diagnosis, Stage3Plan } from "@/lib/schemas";

export function ResultHero({ diagnosis, plan }: { diagnosis: Stage2Diagnosis; plan: Stage3Plan }) {
  const severityLabel = severityLabels[diagnosis.severity];

  return (
    <section className="animate-fade-in rounded-lg border border-moss/20 bg-mint p-6 shadow-soft">
      <div className="flex items-start gap-3">
        <Sparkles className="mt-1 h-5 w-5 shrink-0 text-moss" aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-moss">陪跑结论</p>
          <h2 className="mt-2 text-2xl font-semibold leading-snug text-ink">
            初步判断：{diagnosis.root_cause.label}（{severityLabel}）。已为你生成 {plan.weeks.length} 周训练计划：{plan.plan_title}。
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink/70">接下来重点不是一次看完报告，而是每天完成小任务、记录反馈，再持续微调训练节奏。</p>
        </div>
      </div>
    </section>
  );
}
