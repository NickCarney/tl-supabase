"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Chat() {
  const [model, setModel] = useState("gpt-3.5-turbo");

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: {
      model,
    },
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {/* Model Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Model:</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="p-2 border border-zinc-300 rounded"
        >
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-4-turbo">GPT-4 Turbo</option>
        </select>
      </div>

      {/* Messages */}
      {messages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === "user" ? "User: " : "AI: "}
          {message.parts.map((part, i) => {
            if (part.type === "text") {
              return <div key={`${message.id}-${i}`}>{part.text}</div>;
            }
            return null;
          })}
        </div>
      ))}

      {/* Input Field */}
      <form onSubmit={handleSubmit}>
        <input
          className="dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl relative"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>

      <a href="/" className="text-sm text-black text-center">
        Back
      </a>
    </div>
  );
}
