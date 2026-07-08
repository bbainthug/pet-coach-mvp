import type { Stage2Diagnosis } from "./schemas";

export const severityLabels: Record<Stage2Diagnosis["severity"], string> = {
  low: "低度",
  medium: "中度",
  high: "高度"
};
