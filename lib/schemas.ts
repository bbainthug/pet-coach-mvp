import { z } from "zod";

export const intakeSchema = z.object({
  species: z.enum(["dog", "cat"]),
  breed: z.string().trim().min(1, "请填写品种"),
  ageText: z.string().trim().min(1, "请填写年龄"),
  sex: z.enum(["male", "female", "unknown"]).default("unknown"),
  neutered: z.boolean(),
  freeText: z.string().trim().min(8, "请至少描述 8 个字的问题行为"),
  imageDataUrl: z.string().nullable().optional(),
  imageName: z.string().nullable().optional()
});

export type Intake = z.infer<typeof intakeSchema>;

export const stage1ProfileSchema = z.object({
  species: z.enum(["dog", "cat"]),
  breed: z.string().nullable(),
  age_months: z.number().nullable(),
  neutered: z.boolean().nullable(),
  primary_behavior: z.string().nullable(),
  symptoms: z.array(z.string()).default([]),
  triggers: z.array(z.string()).default([]),
  already_tried: z.array(z.string()).default([]),
  severity_signals: z.array(z.string()).default([]),
  image_observations: z.string().nullable()
});

export const stage2DiagnosisSchema = z.object({
  root_cause: z.object({
    label: z.string(),
    explain: z.string()
  }),
  secondary_factors: z
    .array(
      z.object({
        label: z.string(),
        explain: z.string()
      })
    )
    .default([]),
  severity: z.enum(["low", "medium", "high"]),
  medical_flag: z.object({
    is_flagged: z.boolean(),
    reason: z.string().nullable()
  }),
  confidence: z.string()
});

export const dailyTaskSchema = z.object({
  task: z.string(),
  duration: z.string(),
  success: z.string()
});

export const trainingWeekSchema = z.object({
  week: z.number(),
  theme: z.string(),
  daily_tasks: z.array(dailyTaskSchema),
  tools: z.array(z.string()).default([])
});

export const stage3PlanSchema = z.object({
  plan_title: z.string(),
  goal: z.string(),
  weeks: z.array(trainingWeekSchema).min(1),
  red_lines: z.array(z.string()).default([]),
  disclaimer: z.string()
});

export type Stage1Profile = z.infer<typeof stage1ProfileSchema>;
export type Stage2Diagnosis = z.infer<typeof stage2DiagnosisSchema>;
export type DailyTask = z.infer<typeof dailyTaskSchema>;
export type TrainingWeek = z.infer<typeof trainingWeekSchema>;
export type Stage3Plan = z.infer<typeof stage3PlanSchema>;

export type CoachResult = {
  stage1: Stage1Profile;
  stage2: Stage2Diagnosis;
  stage3: Stage3Plan;
  mode: "mock" | "live";
  generatedAt: string;
};
