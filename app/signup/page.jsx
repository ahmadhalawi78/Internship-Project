'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signup } from '../actions/auth'

export default function signupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
  e.preventDefault() // prevents page reload
  setLoading(true)
  setError('')

  const formData = new FormData(e.target)

  try {
    await signup(null, formData)
  } catch (err) {
    if (err.message?.includes('NEXT_REDIRECT')) return
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

  return (
    <div style={{ padding: '24px' }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required />
        </div>
        <div>
          <label>Role:</label>
          <select name="role" defaultValue="user">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
