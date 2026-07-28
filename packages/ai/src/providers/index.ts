import { getAnthropicModel } from "./anthropic";
import { getGeminiModel } from "./gemini";
import { getOpenAIModel } from "./openai";
import type { LanguageModel } from "ai";

export type AIProvider = "anthropic" | "gemini" | "openai";

export type ModelSelection = {
  apiKey: string;
  provider?: AIProvider;
  modelId?: string;
};

export function getModel({
  apiKey,
  provider = "openai",
  modelId,
}: ModelSelection): LanguageModel {
  switch (provider) {
    case "anthropic":
      return getAnthropicModel(apiKey, modelId);
    case "gemini":
      return getGeminiModel(apiKey, modelId);
    case "openai":
      return getOpenAIModel(apiKey, modelId);
  }
}

export { getAnthropicModel, getGeminiModel, getOpenAIModel };
