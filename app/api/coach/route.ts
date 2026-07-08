import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { runPetCoach } from "@/lib/coach";
import { intakeSchema } from "@/lib/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = intakeSchema.parse(payload);
    const result = await runPetCoach(input);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "表单信息不完整。",
          details: error.issues.map((issue) => issue.message)
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "生成训练计划失败。"
      },
      { status: 500 }
    );
  }
}
