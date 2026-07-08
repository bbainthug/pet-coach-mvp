import {
  buildStage1UserPrompt,
  buildStage2UserPrompt,
  buildStage3UserPrompt,
  stage1SystemPrompt,
  stage2SystemPrompt,
  stage3SystemPrompt
} from "./prompts";
import { callDeepSeekJson } from "./llm";
import { buildMockCoachResult } from "./sample";
import type { CoachResult, Intake } from "./schemas";
import { intakeSchema, stage1ProfileSchema, stage2DiagnosisSchema, stage3PlanSchema } from "./schemas";

type CoachMode = "mock" | "live";

function resolveMode(mode?: CoachMode): CoachMode {
  if (mode) {
    return mode;
  }

  if (process.env.DEEPSEEK_USE_MOCK === "true") {
    return "mock";
  }

  if (process.env.DEEPSEEK_USE_MOCK === "false") {
    return "live";
  }

  return process.env.DEEPSEEK_API_KEY?.trim() ? "live" : "mock";
}

export async function runPetCoach(input: Intake, options: { mode?: CoachMode } = {}): Promise<CoachResult> {
  const parsedInput = intakeSchema.parse(input);
  const mode = resolveMode(options.mode);

  if (mode === "mock") {
    return buildMockCoachResult(parsedInput);
  }

  const stage1Raw = await callDeepSeekJson({
    systemPrompt: stage1SystemPrompt,
    userPrompt: buildStage1UserPrompt(parsedInput),
    imageDataUrl: parsedInput.imageDataUrl
  });
  const stage1 = stage1ProfileSchema.safeParse(stage1Raw);

  if (!stage1.success) {
    console.warn("[coach] live 输出不符合 schema，回退 mock", {
      s1: false,
      s2: null,
      s3: null
    });
    return buildMockCoachResult(parsedInput);
  }

  const stage2Raw = await callDeepSeekJson({
    systemPrompt: stage2SystemPrompt,
    userPrompt: buildStage2UserPrompt(stage1.data)
  });
  const stage2 = stage2DiagnosisSchema.safeParse(stage2Raw);

  if (!stage2.success) {
    console.warn("[coach] live 输出不符合 schema，回退 mock", {
      s1: true,
      s2: false,
      s3: null
    });
    return buildMockCoachResult(parsedInput);
  }

  const stage3Raw = await callDeepSeekJson({
    systemPrompt: stage3SystemPrompt,
    userPrompt: buildStage3UserPrompt(stage1.data, stage2.data)
  });
  const stage3 = stage3PlanSchema.safeParse(stage3Raw);

  if (!stage3.success) {
    console.warn("[coach] live 输出不符合 schema，回退 mock", {
      s1: true,
      s2: true,
      s3: false
    });
    return buildMockCoachResult(parsedInput);
  }

  return {
    stage1: stage1.data,
    stage2: stage2.data,
    stage3: stage3.data,
    mode: "live",
    generatedAt: new Date().toISOString()
  };
}
