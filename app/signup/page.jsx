'use client'

import { signUp } from '../actions/auth'
import { useActionState } from 'react'
import Link from 'next/link'

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUp, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        
        {/* Use formAction directly on the form */}
        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"  // CRITICAL: Must have name attribute
              type="email"
              required
              className="w-full p-2 border rounded"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"  // CRITICAL: Must have name attribute
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
            {isPending ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/signin" className="text-blue-600 text-sm">
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}