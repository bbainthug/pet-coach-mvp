"use client";

import { AlertCircle, FlaskConical } from "lucide-react";
import { useState } from "react";
import { DiagnosisCard } from "@/components/DiagnosisCard";
import { IntakeForm } from "@/components/IntakeForm";
import { ResultHero } from "@/components/ResultHero";
import { StageLoader } from "@/components/StageLoader";
import { TrainingPlan } from "@/components/TrainingPlan";
import type { CoachResult, Intake } from "@/lib/schemas";

function isRenderableCoachResult(result: CoachResult | null): result is CoachResult {
  return Boolean(
    result?.stage1 &&
      result.stage2?.root_cause?.label &&
      result.stage2?.root_cause?.explain &&
      result.stage2?.medical_flag &&
      Array.isArray(result.stage2.secondary_factors) &&
      result.stage3?.plan_title &&
      result.stage3?.goal &&
      Array.isArray(result.stage3.weeks) &&
      result.stage3.weeks.length > 0 &&
      Array.isArray(result.stage3.red_lines)
  );
}

export default function Home() {
  const [result, setResult] = useState<CoachResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  async function handleSubmit(input: Intake) {
    setLoading(true);
    setError(null);
    setResult(null);
    setStep(0);
    const intervalId = window.setInterval(() => {
      setStep((current) => Math.min(2, current + 1));
    }, 2500);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
      });

      const payload = (await response.json()) as CoachResult | { error?: string; details?: string[] };

      if (!response.ok) {
        const message = "error" in payload && payload.error ? payload.error : "请求失败。";
        const details = "details" in payload && payload.details?.length ? ` ${payload.details.join(" ")}` : "";
        throw new Error(`${message}${details}`);
      }

      setResult(payload as CoachResult);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "生成训练计划失败。");
    } finally {
      window.clearInterval(intervalId);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:grid-cols-[420px_minmax(0,1fr)] md:px-6 lg:py-8">
        <div className="md:sticky md:top-6 md:self-start">
          <IntakeForm loading={loading} onSubmit={handleSubmit} />
        </div>

        <section className="space-y-5">
          {error ? (
            <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <p>{error}</p>
            </div>
          ) : null}

          {loading ? (
            <StageLoader activeStep={step} />
          ) : isRenderableCoachResult(result) ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-ink/70 shadow-soft">
                <span className="inline-flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-moss" aria-hidden="true" />
                  {result.mode === "mock" ? "Demo mock 输出" : "DeepSeek live 输出"}
                </span>
                <span>{new Date(result.generatedAt).toLocaleString("zh-CN")}</span>
              </div>
              <ResultHero diagnosis={result.stage2} plan={result.stage3} />
              <DiagnosisCard profile={result.stage1} diagnosis={result.stage2} />
              <TrainingPlan plan={result.stage3} />
            </>
          ) : result ? (
            <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <h2 className="font-semibold">本次生成异常，请重试</h2>
                <p className="mt-1">模型返回结构不完整，页面已拦截渲染错误。请重新生成，或切换 mock 模式录屏。</p>
              </div>
            </div>
          ) : (
            <div className="grid min-h-[560px] place-items-center rounded-lg border border-dashed border-black/20 bg-white/55 p-8 text-center">
              <div>
                <FlaskConical className="mx-auto h-10 w-10 text-moss" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-semibold text-ink">等待生成</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-ink/65">第 6 节样例已预填,提交后会渲染诊断、6 周训练计划、每日任务和安全红线。</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
