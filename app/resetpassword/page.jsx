'use client'

import { resetPassword } from '../actions/auth'
import { useActionState } from 'react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [state, action, pending] = useActionState(resetPassword, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        
        <form action={action} className="space-y-4">
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

          {state?.error && (
            <div className="p-2 bg-red-100 text-red-600 text-sm rounded">
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="p-2 bg-green-100 text-green-600 text-sm rounded">
              Check your email for the reset link!
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-blue-600 text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}