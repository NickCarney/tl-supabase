'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; 

export default function SearchPage() {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);// eslint-disable-line
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
      const getUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUserId(session.user.id);
        }
      };
  
      getUser();
    }, []);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          userId
        })
      });

      const data = await res.json();

      if (res.ok) {
        setResults(data);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Search Embeddings</h1>

      <div className="my-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your search query..."
          className="border p-2 w-full"
        />
        <button
          onClick={handleSearch}
          className="mt-2 px-4 py-2 bg-blue-500 text-white"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="mt-4">
        {results.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold">Results:</h2>
            <ul>
              {results.map((result, idx) => (
                <li key={idx} className="mt-2 p-2 border">
                  <p><strong>Text:</strong> {result.text}</p>
                  <p><strong>Similarity:</strong> {result.similarity.toFixed(4)}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}
