"use client";

import { CheckCircle2, ChevronDown, Circle, Clock, Copy, Goal, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Stage3Plan } from "@/lib/schemas";
import { RedLineAlert } from "./RedLineAlert";

function taskKey(week: number, taskIndex: number) {
  return `${week}-${taskIndex}`;
}

function defaultCheckedTasks(plan: Stage3Plan) {
  const firstWeek = plan.weeks[0];
  return firstWeek?.daily_tasks.length ? new Set([taskKey(firstWeek.week, 0)]) : new Set<string>();
}

function storageKeyForPlan(plan: Stage3Plan) {
  return `petcoach:checked-tasks:${plan.plan_title}`;
}

function formatPlanForClipboard(plan: Stage3Plan) {
  const weeks = plan.weeks
    .map((week) => {
      const tasks = week.daily_tasks
        .map((task, index) => `${index + 1}. ${task.task}｜${task.duration}｜成功标准：${task.success}`)
        .join("\n");
      return `Week ${week.week} ${week.theme}\n${tasks}\n道具：${week.tools.join("、")}`;
    })
    .join("\n\n");

  return `${plan.plan_title}\n\n目标：${plan.goal}\n\n${weeks}\n\n红线：\n${plan.red_lines.map((line) => `- ${line}`).join("\n")}\n\n${plan.disclaimer}`;
}

function getNextDayAdjustment(checkedToday: number, totalToday: number) {
  if (totalToday === 0 || checkedToday === 0) {
    return "明日从第一个低难度任务重新开始，不增加独处时长。";
  }

  if (checkedToday >= totalToday) {
    return "明日可把稳定任务时长增加 2 分钟；若出现嚎叫或抓门，立刻退回上一档。";
  }

  return "明日先补齐漏打任务，不增加独处时长；连续两天稳定后再延长练习。";
}

export function TrainingPlan({ plan }: { plan: Stage3Plan }) {
  const storageKey = useMemo(() => storageKeyForPlan(plan), [plan]);
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(() => defaultCheckedTasks(plan));
  const [copied, setCopied] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const totalTasks = useMemo(() => plan.weeks.reduce((sum, week) => sum + week.daily_tasks.length, 0), [plan.weeks]);
  const firstWeekTaskKeys = useMemo(() => {
    const firstWeek = plan.weeks[0];
    return firstWeek?.daily_tasks.map((_, index) => taskKey(firstWeek.week, index)) ?? [];
  }, [plan.weeks]);
  const checkedCount = checkedTasks.size;
  const checkedToday = firstWeekTaskKeys.filter((key) => checkedTasks.has(key)).length;
  const totalDays = plan.weeks.length * 7;
  const currentDay = Math.min(totalDays, Math.max(1, checkedCount));
  const progress = totalTasks > 0 ? Math.round((checkedCount / totalTasks) * 100) : 0;
  const nextDayAdjustment = getNextDayAdjustment(checkedToday, firstWeekTaskKeys.length);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      const parsed = stored ? (JSON.parse(stored) as unknown) : null;

      if (Array.isArray(parsed) && parsed.every((key) => typeof key === "string")) {
        setCheckedTasks(new Set(parsed));
      } else {
        setCheckedTasks(defaultCheckedTasks(plan));
      }
    } catch {
      setCheckedTasks(defaultCheckedTasks(plan));
    } finally {
      setStorageReady(true);
    }
  }, [plan, storageKey]);

  useEffect(() => {
    if (!storageReady) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify([...checkedTasks]));
  }, [checkedTasks, storageKey, storageReady]);

  function toggleTask(key: string) {
    setCheckedTasks((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  async function copyPlan() {
    await navigator.clipboard.writeText(formatPlanForClipboard(plan));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section className="animate-fade-in rounded-lg border border-black/10 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-moss">Stage 3 计划</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">{plan.plan_title}</h2>
          <p className="mt-2 flex max-w-2xl gap-2 text-sm leading-6 text-ink/75">
            <Goal className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden="true" />
            <span>{plan.goal}</span>
          </p>
        </div>
        <span className="rounded-full border border-moss/20 bg-mint px-3 py-1 text-sm font-semibold text-moss">
          {plan.weeks.length} 周
        </span>
      </div>

      <div className="mt-6 rounded-lg border border-moss/20 bg-mint/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <div>
            <p className="font-semibold text-ink">陪跑进度</p>
            <p className="mt-1 text-ink/65">Day {currentDay} / {totalDays}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-ink/70">已完成 {checkedCount} / {totalTasks} 项</span>
            <button
              type="button"
              onClick={() => void copyPlan()}
              className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 font-medium text-ink transition hover:bg-paper"
              aria-label={copied ? "已复制" : "复制计划"}
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              {copied ? "已复制" : "复制计划"}
            </button>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-moss transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 rounded-md bg-white/70 px-3 py-2 text-sm leading-6 text-moss">
          <p>
            <span className="font-semibold">次日提示（本地规则演示）：</span>
            {nextDayAdjustment}
          </p>
          <p className="mt-1 text-xs leading-5 text-ink/55">正式版会把打卡反馈回传给 AI；当前 Demo 先用完成率规则演示调整逻辑。</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {plan.weeks.map((week, index) => (
          <details key={week.week} className="group rounded-lg border border-black/10 bg-paper" open={index === 0}>
            <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-4">
              <span className="min-w-0">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">Week {week.week}</span>
                <span className="mt-1 block text-base font-semibold text-ink">{week.theme}</span>
              </span>
              <ChevronDown className="h-5 w-5 shrink-0 text-ink/60 transition group-open:rotate-180" aria-hidden="true" />
            </summary>

            <div className="border-t border-black/10 px-4 py-4">
              <div className="grid gap-3">
                {week.daily_tasks.map((task, taskIndex) => {
                  const key = taskKey(week.week, taskIndex);
                  const checked = checkedTasks.has(key);

                  return (
                  <div key={task.task} className="rounded-md bg-white p-4">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleTask(key)}
                        className="mt-0.5 rounded-full text-moss transition hover:scale-105"
                        aria-label={`打卡 Week ${week.week} 任务 ${taskIndex + 1}`}
                      >
                        {checked ? <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> : <Circle className="h-5 w-5" aria-hidden="true" />}
                      </button>
                      <div>
                        <p className="font-medium text-ink">{task.task}</p>
                        <p className="mt-2 flex gap-2 text-sm text-ink/65">
                          <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>{task.duration}</span>
                        </p>
                        <p className="mt-2 text-sm leading-6 text-ink/70">成功标准: {task.success}</p>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink/70">
                <Wrench className="h-4 w-4 text-moss" aria-hidden="true" />
                {week.tools.map((tool) => (
                  <span key={tool} className="rounded-full border border-black/10 bg-white px-2.5 py-1">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-6">
        <RedLineAlert redLines={plan.red_lines} />
      </div>

      <p className="mt-5 rounded-lg bg-ink px-4 py-3 text-sm leading-6 text-white">{plan.disclaimer}</p>
    </section>
  );
}
