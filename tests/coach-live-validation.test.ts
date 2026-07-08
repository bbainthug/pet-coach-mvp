import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sampleIntake, sampleStage1, sampleStage2 } from "@/lib/sample";

const callDeepSeekJson = vi.fn();
let warnSpy: ReturnType<typeof vi.spyOn>;

vi.mock("@/lib/llm", () => ({
  callDeepSeekJson
}));

describe("runPetCoach live output validation", () => {
  beforeEach(() => {
    callDeepSeekJson.mockReset();
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it("falls back to mock when live stage output does not match the render schema", async () => {
    callDeepSeekJson
      .mockResolvedValueOnce(sampleStage1)
      .mockResolvedValueOnce(sampleStage2)
      .mockResolvedValueOnce({
        plan: {
          title: "柯基分离焦虑训练",
          weeks: [{ week: 1, goal: "建立安全区", tasks: [] }]
        }
      });

    const { runPetCoach } = await import("@/lib/coach");
    const result = await runPetCoach(sampleIntake, { mode: "live" });

    expect(result.mode).toBe("mock");
    expect(result.stage2.root_cause.label).toBe("分离焦虑");
    expect(result.stage3.weeks).toHaveLength(6);
    expect(warnSpy).toHaveBeenCalledWith("[coach] live 输出不符合 schema，回退 mock", {
      s1: true,
      s2: true,
      s3: false
    });
  });
});
