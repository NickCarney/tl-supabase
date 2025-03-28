'use client'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import { useRouter } from 'next/navigation'

export default function Home() {
  const {push} = useRouter();
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
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
          <button onClick={() => push('/DocUpload')} className='bg-blue-500 text-white p-2 rounded'>
              Upload Document
            </button>
            <hr />
            <button onClick={() => push('/search')} className='bg-blue-500 text-white p-2 rounded'>
              Upload Document
            </button>
          </main>
        </div>
      )}
    </div>
  )
}
