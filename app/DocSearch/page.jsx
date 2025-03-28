'use client'
import { useState } from 'react'

export default function DocumentSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query) return

    setLoading(true)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Failed to search')

      setResults(data.results || [])
    } catch (error) {
      console.error('Error:', error)
      alert(`Error searching documents: ${error.message}`)
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
