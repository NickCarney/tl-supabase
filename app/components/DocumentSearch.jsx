// components/DocumentSearch.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default function DocumentSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query) return

    setLoading(true)
    try {
      // Generate embedding for the search query
      const embeddingResponse = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: query,
      })
      const [{ embedding }] = embeddingResponse.data.data

      // Search for similar documents using the custom function
      const { data, error } = await supabase
        .rpc('match_documents', {
          query_embedding: embedding,
          match_threshold: 0.7,
          match_count: 5
        })

      if (error) throw error
      setResults(data || [])
    } catch (error) {
      alert('Error searching documents: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Search Documents</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div>
        <h3>Results</h3>
        {results.length > 0 ? (
          <ul>
            {results.map((doc) => (
              <li key={doc.id}>
                <h4>{doc.title}</h4>
                <p>{doc.content.substring(0, 200)}...</p>
                <small>Similarity: {(doc.similarity * 100).toFixed(2)}%</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  )
}
