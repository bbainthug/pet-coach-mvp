import { parseJsonOnly } from "./json";

type DeepSeekMessage = {
  role: "system" | "user";
  content:
    | string
    | Array<
        | {
            type: "text";
            text: string;
          }
        | {
            type: "image_url";
            image_url: {
              url: string;
            };
          }
      >;
};

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export async function callDeepSeekJson({
  systemPrompt,
  userPrompt,
  imageDataUrl
}: {
  systemPrompt: string;
  userPrompt: string;
  imageDataUrl?: string | null;
}): Promise<unknown> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY 未配置。");
  }

  const baseUrl = (process.env.DEEPSEEK_BASE_URL?.trim() || "https://api.deepseek.com").replace(/\/$/, "");
  const model = process.env.DEEPSEEK_MODEL?.trim() || "deepseek-chat";
  const messages = buildDeepSeekMessages({
    systemPrompt,
    userPrompt,
    imageDataUrl,
    sendImage: process.env.DEEPSEEK_SEND_IMAGE === "true"
  });

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages,
      response_format: { type: "json_object" },
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`DeepSeek API 请求失败: ${response.status} ${detail.slice(0, 240)}`);
  }

  const payload = (await response.json()) as DeepSeekResponse;
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("DeepSeek API 没有返回可解析内容。");
  }

  return parseJsonOnly<unknown>(content);
}

export function buildDeepSeekMessages({
  systemPrompt,
  userPrompt,
  imageDataUrl,
  sendImage
}: {
  systemPrompt: string;
  userPrompt: string;
  imageDataUrl?: string | null;
  sendImage: boolean;
}): DeepSeekMessage[] {
  const userContent =
    sendImage && imageDataUrl
      ? [
          { type: "text" as const, text: userPrompt },
          { type: "image_url" as const, image_url: { url: imageDataUrl } }
        ]
      : userPrompt;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContent }
  ];
}
