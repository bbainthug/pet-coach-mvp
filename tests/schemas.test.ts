import { describe, expect, it } from "vitest";
import { sampleStage1, sampleStage2, sampleStage3 } from "@/lib/sample";
import { stage1ProfileSchema, stage2DiagnosisSchema, stage3PlanSchema } from "@/lib/schemas";

describe("stage output schemas", () => {
  it("accepts the canonical sample stage outputs", () => {
    expect(stage1ProfileSchema.safeParse(sampleStage1).success).toBe(true);
    expect(stage2DiagnosisSchema.safeParse(sampleStage2).success).toBe(true);
    expect(stage3PlanSchema.safeParse(sampleStage3).success).toBe(true);
  });

  it("rejects common live output shape drift that would break the result page", () => {
    expect(stage2DiagnosisSchema.safeParse({ root_cause: "分离焦虑", severity: "medium" }).success).toBe(false);
    expect(
      stage3PlanSchema.safeParse({
        plan: {
          title: "柯基分离焦虑训练",
          weeks: [{ week: 1, goal: "建立安全区", tasks: [] }]
        }
      }).success
    ).toBe(false);
  });
});
