import { Activity, AlertTriangle, CheckCircle2, Stethoscope } from "lucide-react";
import { severityLabels } from "@/lib/severity";
import type { Stage1Profile, Stage2Diagnosis } from "@/lib/schemas";

const severityCopy: Record<Stage2Diagnosis["severity"], { className: string; meterClassName: string }> = {
  low: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-900",
    meterClassName: "bg-emerald-500 text-white"
  },
  medium: {
    className: "border-amber-200 bg-amber-50 text-amber-950",
    meterClassName: "bg-amber-500 text-white"
  },
  high: {
    className: "border-red-200 bg-red-50 text-red-950",
    meterClassName: "bg-red-500 text-white"
  }
};

export function DiagnosisCard({ profile, diagnosis }: { profile: Stage1Profile; diagnosis: Stage2Diagnosis }) {
  const severity = severityCopy[diagnosis.severity];
  const severityLabel = severityLabels[diagnosis.severity];

  return (
    <section className="animate-fade-in rounded-lg border border-black/10 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-moss">Stage 2 诊断</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">{diagnosis.root_cause.label}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/75">{diagnosis.root_cause.explain}</p>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${severity.className}`}>
          <Activity className="h-4 w-4" aria-hidden="true" />
          {severityLabel}
        </span>
      </div>

      <div className="mt-5" aria-label={`严重度：${severityLabel}`}>
        <div className="mb-2 flex items-center justify-between text-sm text-ink/65">
          <span>严重度刻度</span>
          <span className="font-semibold text-ink">{severityLabel}</span>
        </div>
        <div className="grid grid-cols-3 overflow-hidden rounded-md border border-black/10 bg-paper text-center text-xs font-semibold">
          {(["low", "medium", "high"] as const).map((level) => (
            <div
              key={level}
              className={`px-2 py-2 ${diagnosis.severity === level ? severityCopy[level].meterClassName : "bg-white text-ink/55"}`}
            >
              {severityLabels[level]}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-black/10 bg-paper p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
            <CheckCircle2 className="h-4 w-4 text-moss" aria-hidden="true" />
            结构化画像
          </div>
          <dl className="space-y-2 text-sm text-ink/75">
            <div className="flex justify-between gap-4">
              <dt>品种/年龄</dt>
              <dd className="text-right font-medium text-ink">{profile.breed ?? "未提供"} · {profile.age_months ?? "未知"}个月</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>主要行为</dt>
              <dd className="text-right font-medium text-ink">{profile.primary_behavior ?? "待确认"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>触发场景</dt>
              <dd className="text-right font-medium text-ink">{profile.triggers.join("、") || "未提供"}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-black/10 bg-paper p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
            {diagnosis.medical_flag.is_flagged ? (
              <AlertTriangle className="h-4 w-4 text-red-600" aria-hidden="true" />
            ) : (
              <Stethoscope className="h-4 w-4 text-moss" aria-hidden="true" />
            )}
            医疗边界
          </div>
          <p className="text-sm leading-6 text-ink/75">
            {diagnosis.medical_flag.is_flagged
              ? diagnosis.medical_flag.reason
              : "当前描述未触发明显医疗风险信号。"}
          </p>
          <p className="mt-3 text-sm leading-6 text-ink/65">{diagnosis.confidence}</p>
        </div>
      </div>

      {diagnosis.secondary_factors.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-ink">次要因素</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {diagnosis.secondary_factors.map((factor) => (
              <div key={factor.label} className="rounded-lg border border-black/10 p-4">
                <p className="font-medium text-ink">{factor.label}</p>
                <p className="mt-1 text-sm leading-6 text-ink/70">{factor.explain}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
