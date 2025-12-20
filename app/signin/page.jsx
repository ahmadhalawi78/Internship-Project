'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signin } from '../actions/auth'

export default function SigninPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.target)

    const result = await signin(null, formData)

    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else {
      // Redirect after successful login
      router.push('/admin')
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
