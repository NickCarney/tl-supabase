import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { query, userId } = await req.json();

  try {
    // Generate query embedding
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query,
    });

    const queryEmbedding = response.data[0].embedding;

    // Perform similarity search
    const { data, error } = await supabase.rpc('match_embeddings', {
      query_embedding: queryEmbedding,
      match_threshold: 0.75,
      match_count: 5,
      user_id: userId,
    });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
