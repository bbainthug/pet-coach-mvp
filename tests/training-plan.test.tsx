import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { TrainingPlan } from "@/components/TrainingPlan";
import { sampleStage3 } from "@/lib/sample";

describe("TrainingPlan", () => {
  it("renders the plan title, weekly tasks, red lines, and a single disclaimer", () => {
    render(<TrainingPlan plan={sampleStage3} />);

    expect(screen.getByRole("heading", { name: sampleStage3.plan_title })).toBeInTheDocument();
    expect(screen.getByText("建立安全区")).toBeInTheDocument();
    expect(screen.getByText("降低离家信号敏感度")).toBeInTheDocument();
    expect(screen.getAllByText(sampleStage3.disclaimer)).toHaveLength(1);
    expect(screen.getByText(sampleStage3.red_lines[0])).toBeInTheDocument();
  });
});
