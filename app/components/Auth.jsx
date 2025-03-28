// components/Auth.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) alert(error.message)
    else alert('Check your email for the confirmation link!')
    setLoading(false)
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) alert(error.message)
    setLoading(false)
  }

  return (
    <div>
      <h1>Supabase Auth + Vector DB Demo</h1>
      <form>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignUp} disabled={loading}>
          Sign Up
        </button>
        <button onClick={handleSignIn} disabled={loading}>
          Sign In
        </button>
      </form>
    </div>
  )
}
