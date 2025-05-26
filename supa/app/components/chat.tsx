"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

const availableModels = [
  { value: "gpt-3.5-turbo-instruct", label: "GPT-3.5 Turbo" },
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4-turbo-instruct", label: "GPT-4 Turbo" },
  { value: "claude-3-opus-20240229", label: "Claude 3 Opus" },
  { value: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet" },
  { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku" },
];

export default function Chat() {
  const [model, setModel] = useState(availableModels[0].value);

  async function saveToSupabase() {
    try {
      const res = await fetch("/api/embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          messages,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("saved successfully");
      } else {
        console.log(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  }

  const { error, status, messages, input, handleInputChange, handleSubmit } =
    useChat({
      body: {
        model,
      },
    });

  return (
    <main>
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        {/* Model Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Select Model:
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="p-2 border border-zinc-300 rounded w-full"
          >
            {availableModels.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
        </div>

        {/* Messages */}
        {messages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap">
            {message.role === "user" ? "User: " : "AI: "}
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return <div key={`${message.id}-${i}`}>{part.text}</div>;
                case "tool-invocation":
                  return (
                    <pre key={`${message.id}-${i}`}>
                      {JSON.stringify(part.toolInvocation, null, 2)}
                    </pre>
                  );
              }
            })}
          </div>
        ))}

        {/* Input Field */}
        <form onSubmit={handleSubmit} className="mb-8">
          <input
            className="dark:bg-zinc-900 w-full max-w-md p-2 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl relative"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
            onSubmit={() => {
              saveToSupabase;
            }}
          />
        </form>

        <p className="text-gray-500">Status: {status}</p>

        {error && (
          <div className="text-red-500">
            <strong>Error:</strong>
            <pre>{error.message}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
