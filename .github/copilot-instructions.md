# Copilot / AI Agent Instructions — Internship-Project

This file contains concise, actionable guidance for AI coding agents working on this repository. Focus on repository-specific patterns, important files, and reproducible developer workflows.

1. Big-picture architecture
- This is a Next.js (App Router) monorepo-style layout under `src/` with a clear frontend/server separation:
  - `src/frontend/` — client-side React components, hooks, and browser Supabase client (`src/frontend/lib/supabase/client.ts`).
  - `src/backend/` — server-side helpers and the server Supabase client (`src/backend/lib/supabase/server.ts`).
  - `src/app/` — Next.js App Router pages and API routes (server or route handlers live here).
  - `src/middleware.ts` — Next.js middleware used for session/cookie handling.

2. Key integrations & patterns
- Supabase is used for auth, data, and realtime. Two clients exist:
  - Browser: `createBrowserClient` in `src/frontend/lib/supabase/client.ts`.
  - Server: `createServerClient` in `src/backend/lib/supabase/server.ts` (wraps `cookies()` for SSR/session-aware calls).
- Realtime pattern: `src/hooks/useChatSubscription.ts` creates Supabase channels and emits events via the event bus `src/lib/events/chatEvents.ts`. Handlers expect `payload.new` for the record.
- Event bus: `ChatEventManager` (singleton) in `src/lib/events/chatEvents.ts` — subscribe with `.on(event, handler)` and `emit(event, data)`.

3. Conventions & import paths
- Path aliases in `tsconfig.json`: import using `@/*`, `@/frontend/*` and `@/backend/*`.
- Client components explicitly use `"use client"` at the top of the file. Server-only code should not include this directive.
- API routes live in `src/app/api/*` following Next.js route conventions, and may import server helpers from `@/backend/*`.

4. Developer workflows and commands
- Common scripts (see `package.json`):
  - `npm run dev` — start Next.js dev server (fast feedback).
  - `npm run build` — build for production.
  - `npm run start` — run built server.
  - `npm run lint` — run ESLint.
  - `npm run verify-setup` — repository-specific setup verification script `scripts/verify-setup.js`.
- Env vars required for Supabase (development):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  Place these in `.env.local` when running locally.

5. Typical change patterns an AI should follow
- Small, focused patches: change one file or a cohesive set (e.g., hook + consumer component) per PR.
- When editing client/server Supabase code, preserve the `createBrowserClient` / `createServerClient` semantics; do not swap these.
- For realtime handlers expect payload shape: `payload.new` contains the DB row — use that as the canonical record.
- Prefer emitting events via `ChatEventManager` instead of calling `router.refresh()` from realtime handlers.

6. Files worth reading before making changes
- `src/frontend/lib/supabase/client.ts` — browser Supabase client
- `src/backend/lib/supabase/server.ts` — server Supabase client & cookie handling
- `src/hooks/useChatSubscription.ts` — current realtime subscription implementation
- `src/lib/events/chatEvents.ts` — simple event bus used across UI
- `src/frontend/components/chat/ChatThread.tsx` — chat UI consumer
- `src/app/actions/` and `src/app/api/` — server actions and API routes (look for side-effects and DB writes)

7. Safety, tests & QA
- There are no unit tests in the repo by default — manual verification is expected.
- Manual QA steps for realtime chat: run `npm run dev`, open two sessions and send a message to confirm the other session receives it (no full-page refresh).
- Be cautious of Row-Level Security (RLS) in Supabase — do not alter security assumptions without verifying server policies.

8. Examples (copy/paste safe)
- Subscribe to chat messages (pattern from `useChatSubscription`):
```ts
const channel = supabase
  .channel(`chat:${threadId || 'all'}`)
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `thread_id=eq.${threadId}` }, (payload) => {
    const newRecord = (payload as any).new;
    ChatEventManager.getInstance().emit('message:received', newRecord);
  })
  .subscribe();
```

9. What NOT to change
- Do not replace `createServerClient`/`createBrowserClient` with other client creation logic without ensuring SSR cookie handling is preserved.
- Do not commit Supabase secret keys to the repo. Use `.env.local` for local testing.

10. If something is unclear
- Start by running `npm run verify-setup` and `npm run dev` to surface missing env or version issues.
- If you need to change an API route or middleware, inspect `src/middleware.ts` and the `app/api` routes to preserve cookie/session flows.

---
If you want, I can iterate on this file to include additional examples (typing/presence, message delete flow) or generate a small QA checklist for the Jira ticket. Does this cover what you had in mind, or should I expand any section?
