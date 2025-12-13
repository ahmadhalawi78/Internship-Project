import Link from 'next/link'
import { createClient } from '../lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome</h1>
        
        {user ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="mb-4">You are logged in as: <strong>{user.email}</strong></p>
            
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="mb-4">You are not logged in</p>
            <div className="space-x-4">
              <Link 
                href="/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}