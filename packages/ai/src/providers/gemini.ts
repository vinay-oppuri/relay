import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

export function getGeminiModel(
  apiKey: string,
  modelId = DEFAULT_GEMINI_MODEL,
): LanguageModel {
  return createGoogleGenerativeAI({ apiKey })(modelId);
}
