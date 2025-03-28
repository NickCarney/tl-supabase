import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '../../lib/supabase';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    // Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query,
    });

    const embedding = embeddingResponse.data[0].embedding;

    // Call the Supabase RPC function
    const { data, error } = await supabase
    .rpc('match_documents', {
      query_embedding: JSON.stringify(embedding),  // Ensure it's passed as JSON
      match_threshold: 0.7,
      match_count: 5
    }, {
      head: true,  // Force Supabase to pick the correct function
    });
  

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to search documents' }, { status: 500 });
    }

    return NextResponse.json({ results: data });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
