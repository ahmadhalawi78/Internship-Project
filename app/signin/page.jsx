'use client'

import { signIn } from '../actions/auth'
import { useActionState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function SignInPage() {
  const [state, formAction, isPending] = useActionState(signIn, null)
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        
        {message && (
          <div className="p-2 bg-green-100 text-green-600 text-sm rounded mb-4">
            {message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full p-2 border rounded"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full p-2 border rounded"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="p-2 bg-red-100 text-red-600 text-sm rounded">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center space-y-2">
          <Link href="/resetpassword" className="text-blue-600 text-sm block">
            Forgot password?
          </Link>
          <Link href="/signup" className="text-blue-600 text-sm block">
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}