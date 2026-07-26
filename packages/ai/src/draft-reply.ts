import { generateText } from "ai";

import { getModel, type ModelSelection } from "./providers";

export type DraftReplyInput = ModelSelection & {
  message: string;
  context?: string;
  tone?: "concise" | "friendly" | "formal";
};

export type DraftReplyResult = {
  text: string;
  finishReason: string;
  usage: {
    inputTokens: number | undefined;
    outputTokens: number | undefined;
    totalTokens: number | undefined;
  };
};

export async function draftReply({
  message,
  context,
  tone = "friendly",
  provider,
  modelId,
}: DraftReplyInput): Promise<DraftReplyResult> {
  const result = await generateText({
    model: getModel({ provider, modelId }),
    system: [
      "Draft a reply to the supplied message.",
      `Use a ${tone} tone.`,
      "Return only the reply, without analysis or surrounding quotation marks.",
    ].join(" "),
    prompt: [
      context ? `Context:\n${context}` : undefined,
      `Message to reply to:\n${message}`,
    ]
      .filter(Boolean)
      .join("\n\n"),
  });

  return {
    text: result.text,
    finishReason: result.finishReason,
    usage: {
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
      totalTokens: result.usage.totalTokens,
    },
  };
}
