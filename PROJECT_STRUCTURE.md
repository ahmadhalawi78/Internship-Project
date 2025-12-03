# Project Structure

This project is organized into separate **Frontend** and **Backend** folders for better code organization and maintainability.

## 📁 Directory Structure

```
src/
├── frontend/              # Frontend (Client-side) code
│   ├── components/        # React components
│   │   ├── feed/         # Feed-related components
│   │   ├── home/         # Home page components
│   │   ├── layout/       # Layout components (Header, Footer, Nav)
│   │   └── listings/     # Listing-related components
│   ├── hooks/            # React hooks
│   │   └── useAuth.ts    # Authentication hook
│   └── lib/              # Client-side libraries
│       └── supabase/     # Supabase client configuration
│           └── client.ts # Browser Supabase client
│
├── backend/              # Backend (Server-side) code
│   ├── api/              # API route handlers (optional - routes stay in app/api)
│   ├── lib/              # Server-side libraries
│   │   └── supabase/     # Supabase server configuration
│   │       └── server.ts # Server Supabase client
│   └── middleware/      # Middleware utilities (optional)
│
├── app/                  # Next.js App Router
│   ├── api/              # API Routes (Next.js convention)
│   │   └── auth/         # Authentication API routes
│   ├── auth/             # Authentication pages
│   │   ├── login/        # Login page
│   │   ├── signup/       # Signup page
│   │   └── auth-code-error/ # Error page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
│
└── middleware.ts         # Next.js middleware (must be at src root)

```

## 🎯 Frontend (`src/frontend/`)

Contains all **client-side** code that runs in the browser:

- **Components**: React components for UI
- **Hooks**: Custom React hooks (e.g., `useAuth`)
- **Lib**: Client-side utilities and configurations
  - Supabase browser client for client-side operations

### Import Paths

Use `@/frontend/*` to import from frontend:

```typescript
import { useAuth } from "@/frontend/hooks/useAuth";
import { Header } from "@/frontend/components/layout/Header";
import { supabaseBrowser } from "@/frontend/lib/supabase/client";
```

## 🔧 Backend (`src/backend/`)

Contains all **server-side** code:

- **Lib**: Server-side utilities and configurations
  - Supabase server client for server-side operations
- **API**: Optional - API route handlers (routes stay in `app/api/` per Next.js convention)
- **Middleware**: Optional - middleware utilities

### Import Paths

Use `@/backend/*` to import from backend:

```typescript
import { supabaseServer } from "@/backend/lib/supabase/server";
```

## 📝 Next.js App Router (`src/app/`)

The `app/` directory follows Next.js 13+ App Router conventions:

- **API Routes**: Must be in `app/api/` (Next.js requirement)
- **Pages**: React Server Components and pages
- **Layout**: Root layout and nested layouts

### API Routes

API routes stay in `app/api/` but can import from `backend/`:

```typescript
// src/app/api/auth/callback/route.ts
import { createServerClient } from "@supabase/ssr";
// Routes handle their own cookie management
```

## 🔐 Middleware

The `middleware.ts` file must be at the `src/` root level (Next.js requirement). It handles:
- Session refresh
- Route protection
- Cookie management

## 📦 Import Aliases

Configured in `tsconfig.json`:

- `@/*` → `./src/*` (general imports)
- `@/frontend/*` → `./src/frontend/*` (frontend imports)
- `@/backend/*` → `./src/backend/*` (backend imports)

## 🚀 Benefits of This Structure

1. **Clear Separation**: Easy to distinguish client vs server code
2. **Better Organization**: Related code is grouped together
3. **Scalability**: Easy to add more frontend/backend modules
4. **Team Collaboration**: Frontend and backend developers can work independently
5. **Maintainability**: Easier to locate and update code

## 📋 File Organization Rules

- **Frontend**: Anything that runs in the browser → `frontend/`
- **Backend**: Anything that runs on the server → `backend/`
- **Shared**: Types, constants, etc. can go in either or a `shared/` folder
- **Next.js Specific**: Pages, API routes, middleware follow Next.js conventions

