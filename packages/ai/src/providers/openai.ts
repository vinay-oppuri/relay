import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export const DEFAULT_OPENAI_MODEL = "gpt-5-mini";

export function getOpenAIModel(
  apiKey: string,
  modelId = DEFAULT_OPENAI_MODEL,
): LanguageModel {
  return createOpenAI({ apiKey })(modelId);
}
