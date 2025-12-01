# Quick Setup Checklist

## ✅ 1. Environment Variables (REQUIRED)

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**How to get these values:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy **Project URL** and **anon/public key**

## ✅ 2. Verify Setup

Run the verification script:
```bash
npm run verify-setup
```

This will check:
- ✅ Environment variables are set
- ✅ All required files exist
- ✅ Dependencies are installed

## ✅ 3. Configure OAuth (Optional)

If you want Google/GitHub login:

1. **In Supabase Dashboard:**
   - Go to **Authentication** → **Providers**
   - Enable Google and/or GitHub
   - Add your OAuth credentials

2. **Add Redirect URLs:**
   - Go to **Authentication** → **URL Configuration**
   - Add: `http://localhost:3000/api/auth/callback`

See `SETUP.md` for detailed OAuth provider setup instructions.

## ✅ 4. Test It!

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Visit: `http://localhost:3000/auth/login`

3. Try:
   - Creating an account
   - Signing in
   - OAuth login (if configured)

## 🎉 You're Done!

Your authentication is now fully set up with Supabase Auth!

