// components/DocumentUpload.jsx
'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import OpenAI from "openai";

const openai = new OpenAI( {apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true } );

export default function DocumentUpload() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!title || !content) return alert('Please fill in all fields')
    
    setLoading(true)
    try {
      // Generate embedding with OpenAI
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: content,
      });
      const [{ embedding }] = embeddingResponse.data.data

      // Store document with embedding
      const { error } = await supabase
        .from('documents')
        .insert({
          title,
          content,
          embedding
        })

      if (error) throw error
      alert('Document uploaded successfully!')
      setTitle('')
      setContent('')
    } catch (error) {
      alert('Error uploading document: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Upload Document</h2>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Document content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>
    </div>
  )
}
