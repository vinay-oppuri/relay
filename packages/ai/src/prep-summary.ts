import { generateText } from "ai";

import { getModel, type ModelSelection } from "./providers";

export type PrepSummaryInput = ModelSelection & {
  title: string;
  description?: string;
  attendees?: Array<{ name?: string; email: string }>;
  notes?: string;
};

export type PrepSummaryResult = {
  text: string;
  finishReason: string;
  totalTokens: number | undefined;
};

export async function createPrepSummary({
  title,
  description,
  attendees = [],
  notes,
  provider,
  modelId,
}: PrepSummaryInput): Promise<PrepSummaryResult> {
  const attendeeList =
    attendees.length > 0
      ? attendees
          .map(({ name, email }) => (name ? `${name} <${email}>` : email))
          .join(", ")
      : "Not provided";

  const result = await generateText({
    model: getModel({ provider, modelId }),
    system:
      "Create a concise meeting preparation brief with objectives, attendee context, talking points, and open questions. Do not invent facts.",
    prompt: [
      `Meeting: ${title}`,
      `Description: ${description ?? "Not provided"}`,
      `Attendees: ${attendeeList}`,
      `Additional notes: ${notes ?? "Not provided"}`,
    ].join("\n"),
  });

  return {
    text: result.text,
    finishReason: result.finishReason,
    totalTokens: result.usage.totalTokens,
  };
}
