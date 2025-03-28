'use client'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import DocumentUpload from './components/DocumentUpload'
import DocumentSearch from './components/DocumentSearch'

export default function Home() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
  
      if (error) {
        console.error('Error fetching session:', error)
      }
  
      setSession(session)
      setLoading(false)
    }
  
    fetchSession()
  
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )
  
    return () => subscription.unsubscribe()
  }, [])
  

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {!session ? (
        <Auth />
      ) : (
        <div>
          <header>
            <h1>My Document Search App</h1>
            <p>Logged in as: {session.user.email}</p>
            <button onClick={handleSignOut}>Sign Out</button>
          </header>

          <main>
            <DocumentUpload />
            <hr />
            <DocumentSearch />
          </main>
        </div>
      )}
    </div>
  )
}
