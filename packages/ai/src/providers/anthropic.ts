import { createAnthropic } from "@ai-sdk/anthropic";
import type { LanguageModel } from "ai";

export const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-6";

export function getAnthropicModel(
  apiKey: string,
  modelId = DEFAULT_ANTHROPIC_MODEL,
): LanguageModel {
  return createAnthropic({ apiKey })(modelId);
}
