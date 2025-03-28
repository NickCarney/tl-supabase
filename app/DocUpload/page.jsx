'use client'
import { useState } from 'react'

export default function DocumentUpload() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!title || !content) return alert('Please fill in all fields')

    setLoading(true)

    useEffect(() => {
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          setUserId(params.get('user_id'));
        }
      }, []);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, userId })
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Failed to upload')

      alert('Document uploaded successfully!')
      setTitle('')
      setContent('')
    } catch (error) {
      console.error('Error:', error)
      alert(`Error uploading document: ${error.message}`)
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
        <br/>
        <textarea
          placeholder="Document content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
        />
        <br/>
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>
    </div>
  )
}
