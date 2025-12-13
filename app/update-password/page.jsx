'use client'

import { updatePassword } from '../actions/auth'
import { useActionState } from 'react'

export default function UpdatePasswordPage() {
  const [state, action, pending] = useActionState(updatePassword, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Set New Password</h2>
        
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
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
            disabled={pending}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}