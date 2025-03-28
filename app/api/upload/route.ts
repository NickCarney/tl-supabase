import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '../../lib/supabase';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { title, content, session_id } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing title or content' }, { status: 400 });
    }

    // Generate embedding with OpenAI
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: content,
    });

    const embedding = embeddingResponse.data[0].embedding;
    console.log(embedding);

    // Store document with embedding in Supabase
    const { error } = await supabase
      .from('documents')
      .insert({
        title,
        user_id: session_id, 
        content,
        embedding: JSON.stringify(embedding)  
      });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Document uploaded successfully' });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
