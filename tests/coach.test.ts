import { describe, expect, it } from "vitest";
import { runPetCoach } from "@/lib/coach";
import { sampleIntake } from "@/lib/sample";

describe("runPetCoach", () => {
  it("runs the section 6 corgi sample through the three-stage demo workflow", async () => {
    const result = await runPetCoach(sampleIntake, { mode: "mock" });

    expect(result.stage1.primary_behavior).toBe("分离焦虑");
    expect(result.stage1.symptoms).toContain("独处时嚎叫");
    expect(result.stage2.root_cause.label).toBe("分离焦虑");
    expect(result.stage2.severity).toBe("medium");
    expect(result.stage3.plan_title).toContain("6 周");
    expect(result.stage3.weeks).toHaveLength(6);
    expect(result.stage3.weeks[0]?.daily_tasks.length).toBeGreaterThanOrEqual(2);
    expect(result.stage3.red_lines.length).toBeGreaterThanOrEqual(2);
    expect(result.stage3.disclaimer).toBe("本计划为行为训练辅助，不替代兽医诊疗。");
  });
});
