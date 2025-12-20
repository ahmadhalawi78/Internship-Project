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
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            required
            className="w-full p-2 border rounded"
          />
          {state?.error && <div className="text-red-600">{state.error}</div>}
          {state?.success && <div className="text-green-600">Check your email!</div>}
          <button type="submit" disabled={pending} className="w-full bg-blue-600 text-white p-2 rounded">
            {pending ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="Internship-Project/signin" className="text-blue-600 text-sm">Back to Login</Link>
        </div>
      </div>
    </div>
  )
}
