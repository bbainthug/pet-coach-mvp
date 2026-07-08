import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DiagnosisCard } from "@/components/DiagnosisCard";
import { ResultHero } from "@/components/ResultHero";
import { StageLoader } from "@/components/StageLoader";
import { TrainingPlan } from "@/components/TrainingPlan";
import { sampleStage1, sampleStage2, sampleStage3 } from "@/lib/sample";

describe("StageLoader", () => {
  it("shows the visible three-stage AI workflow while waiting", () => {
    render(<StageLoader activeStep={1} />);

    expect(screen.getByText("正在结构化你的描述")).toBeInTheDocument();
    expect(screen.getByText("分析行为根因")).toBeInTheDocument();
    expect(screen.getByText("生成 6 周训练计划")).toBeInTheDocument();
    expect(screen.getByText("三段式 AI 工作流")).toBeInTheDocument();
  });
});

describe("ResultHero", () => {
  it("builds the headline from the live result instead of hard-coded copy", () => {
    render(<ResultHero diagnosis={sampleStage2} plan={sampleStage3} />);

    expect(
      screen.getByText("初步判断：分离焦虑（中度）。已为你生成 6 周训练计划：柯基分离焦虑 6 周脱敏计划。")
    ).toBeInTheDocument();
  });
});

describe("TrainingPlan coaching affordances", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("supports persisted check-ins, progress, rule-based tomorrow adjustment, and copying the plan", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText }
    });
    const storageKey = `petcoach:checked-tasks:${sampleStage3.plan_title}`;

    render(<TrainingPlan plan={sampleStage3} />);

    expect(screen.getByText("Day 1 / 42")).toBeInTheDocument();
    expect(screen.getByText("已完成 1 / 12 项")).toBeInTheDocument();
    expect(screen.getByText(/次日提示（本地规则演示）/)).toBeInTheDocument();
    expect(screen.getByText(/明日先补齐漏打任务/)).toBeInTheDocument();
    await waitFor(() => expect(window.localStorage.getItem(storageKey)).toContain("1-0"));

    fireEvent.click(screen.getByRole("button", { name: "打卡 Week 1 任务 2" }));
    expect(screen.getByText("已完成 2 / 12 项")).toBeInTheDocument();
    expect(screen.getByText(/明日可把稳定任务时长增加 2 分钟/)).toBeInTheDocument();
    await waitFor(() => expect(window.localStorage.getItem(storageKey)).toContain("1-1"));

    fireEvent.click(screen.getByRole("button", { name: "复制计划" }));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining(sampleStage3.plan_title));
    await waitFor(() => expect(screen.getByRole("button", { name: "已复制" })).toBeInTheDocument());
  });
});

describe("DiagnosisCard severity meter", () => {
  it("highlights the current severity in a three-segment meter", () => {
    render(<DiagnosisCard profile={sampleStage1} diagnosis={sampleStage2} />);

    expect(screen.getByLabelText("严重度：中度")).toBeInTheDocument();
    expect(screen.getByText("低度")).toBeInTheDocument();
    expect(screen.getAllByText("中度").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("高度")).toBeInTheDocument();
  });
});
