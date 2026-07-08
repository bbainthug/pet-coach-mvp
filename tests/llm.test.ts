import { describe, expect, it } from "vitest";
import { buildDeepSeekMessages } from "@/lib/llm";

describe("buildDeepSeekMessages", () => {
  it("adds an image_url content part when image sending is enabled", () => {
    const messages = buildDeepSeekMessages({
      systemPrompt: "system",
      userPrompt: "user",
      imageDataUrl: "data:image/png;base64,abc",
      sendImage: true
    });

    expect(messages[0]).toEqual({ role: "system", content: "system" });
    expect(messages[1]?.role).toBe("user");
    expect(messages[1]?.content).toEqual([
      { type: "text", text: "user" },
      { type: "image_url", image_url: { url: "data:image/png;base64,abc" } }
    ]);
  });
});
