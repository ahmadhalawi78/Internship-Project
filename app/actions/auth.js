'use server'

import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'

// SIGN UP
export async function signUp(prevState, formData) {
  console.log('signUp called - formData is FormData?', formData instanceof FormData)
  
  const email = formData.get('email')?.toString() || ''
  const password = formData.get('password')?.toString() || ''

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    // IMPORTANT: Don't return anything after redirect
    redirect('/signin?message=Check your email to confirm your account')
    
  } catch (error) {
    console.error('Sign up error:', error)
    
    // Check if it's a redirect error (NEXT_REDIRECT)
    if (error.message?.includes('NEXT_REDIRECT')) {
      // Let it bubble up - Next.js will handle the redirect
      throw error
    }
    
    return { error: 'Server error: ' + error.message }
  }
}

// SIGN IN
export async function signIn(prevState, formData) {
  const email = formData.get('email')?.toString() || ''
  const password = formData.get('password')?.toString() || ''

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    // Redirect without returning
    redirect('/home')
    
  } catch (error) {
    console.error('Sign in error:', error)
    
    if (error.message?.includes('NEXT_REDIRECT')) {
      throw error
    }
    
    return { error: 'Sign in failed' }
  }
}

// RESET PASSWORD
export async function resetPassword(prevState, formData) {
  const email = formData.get('email')?.toString() || ''

  if (!email) {
    return { error: 'Email is required' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
    })

    if (error) {
      return { error: error.message }
    }

    // Return success state (no redirect here)
    return { success: true }
    
  } catch (error) {
    console.error('Reset password error:', error)
    return { error: 'Failed to send reset email' }
  }
}

// UPDATE PASSWORD
export async function updatePassword(prevState, formData) {
  const password = formData.get('password')?.toString() || ''

  if (!password) {
    return { error: 'Password is required' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      return { error: error.message }
    }

    // Redirect without returning
    redirect('/signin?message=Password updated successfully')
    
  } catch (error) {
    console.error('Update password error:', error)
    
    if (error.message?.includes('NEXT_REDIRECT')) {
      throw error
    }
    
    return { error: 'Failed to update password' }
  }
}