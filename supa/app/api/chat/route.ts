import { anthropic } from '@ai-sdk/anthropic';
import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model } = await req.json();

  // Decide provider based on model name
  let providerModel;
  if (model.startsWith('claude-')) {
    providerModel = anthropic(model);
  } else if (model.startsWith('gpt-')) {
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
    tools: {
      weather_f: tool({
        description: "Get the weather in a location (fahrenheit)",
        parameters: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
      weather_c: tool({
        description: "Get the weather in a location (celsius)",
        parameters: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32));
          return {
            location,
            temperature,
          };
        },
      }),
      weather_k: tool({
        description: "Get the weather in a location (kelvin)",
        parameters: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 273);
          return {
            location,
            temperature,
          };
        },
      }),
      send: tool({
        description: "Invoke the send/route.ts endpoint to send a message",
        parameters: z.object({
          message: z.string().describe("The message to send"),
        }),
        execute: async ({ message }) => {
          const response = await fetch("http://localhost:3000/api/send", {
            // Ensure the correct URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(
              `Failed to send email: ${error.error || "Unknown error"}`
            );
          }

          const result = await response.json();
          return result;
        },
      }),
      checkoutSession: tool({
        description: "Create a checkout session for a product",
        parameters: z.object({
          amount: z.number().describe("The amount for the checkout session"),
          currency: z
            .string()
            .describe("The currency for the checkout session"),
        }),
        execute: async ({ amount, currency }) => {
          const response = await fetch(
            "http://localhost:3000/api/checkout_sessions",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount, currency }),
            }
          );

          if (!response.ok) {
            const error = await response.json();
            throw new Error(
              `Failed to create checkout session: ${error.error || "Unknown error"}`
            );
          }

          const result = await response.json();
          return result;
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
