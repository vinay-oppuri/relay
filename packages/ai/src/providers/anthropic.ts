import { anthropic } from "@ai-sdk/anthropic";
import type { LanguageModel } from "ai";

export const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-6";

export function getAnthropicModel(
  modelId = DEFAULT_ANTHROPIC_MODEL,
): LanguageModel {
  return anthropic(modelId);
}
