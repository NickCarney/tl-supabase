import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { chat, answer, userId } = await req.json();

  try {
    const chatResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: chat,
    });

    const answerResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: answer,
    });

    const chatEmbedding = chatResponse.data[0].embedding;
    const answerEmbedding = answerResponse.data[0].embedding;

    const { error } = await supabase
      .from("chats")
      .insert([
        { user_id: userId, chat: chatEmbedding, answer: answerEmbedding },
      ]);

    if (error) throw error;

    return NextResponse.json({ message: "Embedding stored successfully!" });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
