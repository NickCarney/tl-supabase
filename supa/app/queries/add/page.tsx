"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AddQueryPage() {
  const [text, setText] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
      }
    };

    getUser();
  }, []);

  const handleAddQuery = async () => {
    if (!text || !userId) {
      setStatus("Please enter text and ensure you are logged in.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          userId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Query successfully embedded and saved!");
        setText("");
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      setStatus("An error occurred while adding the query.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Add Query and Embed It</h1>

      <div className="my-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a query to embed..."
          className="border p-2 w-full"
          rows={4}
        />
        <button
          onClick={handleAddQuery}
          className="mt-2 px-4 py-2 bg-green-500 text-white"
          disabled={loading || !userId}
        >
          {loading ? "Embedding..." : "Add Query"}
        </button>
      </div>

      {status && <p className="mt-4">{status}</p>}
      {userId && <p className="text-sm text-gray-500">User ID: {userId}</p>}
    </div>
  );
}
