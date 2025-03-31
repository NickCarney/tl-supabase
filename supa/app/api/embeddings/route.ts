import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { text, userId } = await req.json();

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    const embedding = response.data[0].embedding;

    const { error } = await supabase
      .from('embeddings')
      .insert([{ text, embedding, user_id: userId }]);

    if (error) throw error;

    return NextResponse.json({ message: 'Embedding stored successfully!' });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
