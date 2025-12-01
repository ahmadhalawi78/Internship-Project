# Authentication Setup Guide

This guide will help you complete the Supabase Auth setup for your Next.js application.

## ✅ Step 1: Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Supabase credentials:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project (or create a new one)
   - Go to **Settings** → **API**
   - Copy the following values:
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Update `.env.local` with your actual values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## ✅ Step 2: Configure OAuth Providers (Optional)

To enable Google/GitHub OAuth login:

### For Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback` (for development)
   - `https://yourdomain.com/api/auth/callback` (for production)
6. Copy **Client ID** and **Client Secret**
7. In Supabase Dashboard:
   - Go to **Authentication** → **Providers**
   - Enable **Google**
   - Paste your Client ID and Client Secret
   - Save

### For GitHub OAuth:
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: Your app name
   - **Homepage URL**: `http://localhost:3000` (or your production URL)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback`
4. Copy **Client ID** and generate a **Client Secret**
5. In Supabase Dashboard:
   - Go to **Authentication** → **Providers**
   - Enable **GitHub**
   - Paste your Client ID and Client Secret
   - Save

## ✅ Step 3: Configure Supabase Redirect URLs

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Add to **Redirect URLs**:
   - `http://localhost:3000/api/auth/callback`
   - `http://localhost:3000/**` (for development)
   - Your production URL: `https://yourdomain.com/api/auth/callback`

## ✅ Step 4: Verify Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the authentication:
   - Navigate to `http://localhost:3000/auth/login`
   - Try signing up with email/password
   - Check your email for the confirmation link (if email confirmation is enabled)
   - Try OAuth login (if configured)

3. Check the browser console and terminal for any errors

## ✅ Step 5: Test Authentication Flow

1. **Sign Up**: Go to `/auth/signup` and create an account
2. **Email Verification**: Check your email and click the verification link
3. **Sign In**: Go to `/auth/login` and sign in
4. **User State**: Check the navigation bar - you should see your email/avatar
5. **Sign Out**: Click "Sign Out" in the navigation

## Troubleshooting

### Environment variables not working?
- Make sure the file is named `.env.local` (not `.env`)
- Restart your Next.js dev server after adding/changing env variables
- Verify the variable names match exactly (case-sensitive)

### OAuth not working?
- Verify redirect URLs match exactly in both Supabase and OAuth provider settings
- Check that OAuth providers are enabled in Supabase Dashboard
- Ensure Client ID and Secret are correct

### Session not persisting?
- Check browser console for cookie errors
- Verify middleware is working (check Network tab for cookie headers)
- Ensure Supabase URL and keys are correct

## Next Steps

- Customize authentication pages styling
- Add password reset functionality
- Implement role-based access control
- Add user profile pages

