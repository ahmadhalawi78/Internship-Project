'use server'

import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'

// ======================= SIGN UP =======================
export async function signup(prevState, formData) {
  const email = formData.get('email')?.toString() || ''
  const password = formData.get('password')?.toString() || ''
  const role = formData.get('role')?.toString() || 'user'

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signup({
      email,
      password,
    })

    if (error) return { error: error.message }

    // create profile row
    await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      role,
    })

    redirect('/signin?message=Account created successfully')
  } catch (err) {
    console.error('SignUp error:', err)
    return { error: err.message }
  }
}

// ======================= SIGN IN =======================
export async function signin(prevState, formData) {
  const email = formData.get('email')?.toString() || ''
  const password = formData.get('password')?.toString() || ''

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) return { error: error.message }

    return { success: true, user: data.user }
  } catch (err) {
    console.error('SignIn error:', err)
    return { error: err.message }
  }
}
// =======================
// RESET PASSWORD (EMAIL)
// =======================
export async function updatePassword(prevState, formData) {
  const password = formData.get('password')?.toString() || ''

  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  try {
    const supabase = await createClient({ admin: true })

    const { error } = await supabase.auth.updateUser({ password })

    if (error) return { error: error.message }

    redirect('/signin?message=Password updated successfully')
  } catch (error) {
    console.error('Update password error:', error)
    if (error.message?.includes('NEXT_REDIRECT')) throw error
    return { error: 'Failed to update password' }
  }
}

export async function resetPassword(prevState, formData) {
  const email = formData.get('email')?.toString() || ''

  if (!email) {
    return { error: 'Email is required' }
  }

  try {
    // IMPORTANT: admin client
    const supabase = await createClient({ admin: true })

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }

  } catch (error) {
    console.error('Reset password error:', error)
    return { error: error.message }
  }
}
