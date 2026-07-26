import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export const DEFAULT_OPENAI_MODEL = "gpt-5-mini";

export function getOpenAIModel(modelId = DEFAULT_OPENAI_MODEL): LanguageModel {
  return openai(modelId);
}
