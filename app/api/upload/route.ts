import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '../../lib/supabase';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    // Get the authenticated user's session from the headers
    const { data: { session } } = await supabase.auth.getSession();
    
    // If there's no session or user is not authenticated, return an error
    if (!session || !session.user) {
      return NextResponse.json({ error: 'User is not authenticated' }, { status: 401 });
    }

    const { title, content } = await req.json();

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
        user_id: session.user.id,  // Use the user_id from the authenticated session
        content,
        embedding: JSON.stringify(embedding)  // Store as string or jsonb
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
