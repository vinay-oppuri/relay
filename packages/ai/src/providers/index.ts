import { getAnthropicModel } from "./anthropic";
import { getGeminiModel } from "./gemini";
import { getOpenAIModel } from "./openai";
import type { LanguageModel } from "ai";

export type AIProvider = "anthropic" | "gemini" | "openai";

export type ModelSelection = {
  provider?: AIProvider;
  modelId?: string;
};

export function getModel({
  provider = "openai",
  modelId,
}: ModelSelection = {}): LanguageModel {
  switch (provider) {
    case "anthropic":
      return getAnthropicModel(modelId);
    case "gemini":
      return getGeminiModel(modelId);
    case "openai":
      return getOpenAIModel(modelId);
  }
}

export { getAnthropicModel, getGeminiModel, getOpenAIModel };
