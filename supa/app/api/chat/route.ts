import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
// import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model } = await req.json();

  // Decide provider based on model name
  let providerModel;
  if (model.startsWith("claude-")) {
    providerModel = anthropic(model);
  } else if (model.startsWith("gpt-")) {
    providerModel = openai(model);
  } else {
    // return error if model is not supported
    return new Response(
      JSON.stringify({
        error: `Model ${model} is not supported.`,
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const result = streamText({
    model: providerModel,
    messages,
    tools: {},
  });
  console.log("Result:", result);

  return result.toDataStreamResponse();
}
