# LoopLebanon

A community-focused platform designed to facilitate the donation and exchange of items, services, and food within the Lebanese community, aiming to foster mutual aid and reduce waste.

## Overview

LoopLebanon is a full-stack web application built with Next.js 15 (App Router) and Supabase. The platform enables users to create listings for items they want to offer or request, communicate through real-time chat, manage favorites, and receive notifications. An admin panel allows moderation of listings and reviews.

**Tech Stack:**
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL database, Authentication, Storage, Realtime)
- **UI Components:** Lucide React icons, Framer Motion animations, Recharts for admin analytics
- **Validation:** Zod
- **Date Handling:** date-fns

---

## Prerequisites

Before setting up the project, ensure you have:

- **Node.js** 20.x or higher
- **npm** or **yarn** package manager
- **Git** for version control
- **Supabase Account** (free tier works fine)
- **Google OAuth credentials** (if using Google login)
- **GitHub OAuth credentials** (if using GitHub login)

---

## Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd Internship-Project

# Install dependencies
npm install

# Verify setup
npm run verify-setup
```

### 2. Environment Configuration

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret

# Admin Access (comma-separated email addresses)
ADMIN_EMAILS=admin@example.com,admin2@example.com
```

**Where to find these values:**
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the Project URL and anon/service_role keys
4. JWT Secret is also available in the API settings

### 3. Supabase Setup

#### Database Schema

**Core Tables:**
- `profiles` - User profiles with ratings and role management
- `listings` - Items/services offered or requested
- `listing_images` - Images associated with listings
- `favorites` - User-favorited listings
- `reviews` - User ratings and reviews
- `notifications` - In-app notification system

**Chat System:**
- `chat_threads` - Conversation threads between users
- `chat_participants` - Thread membership
- `messages` - Individual chat messages

**Additional Tables:**
- `badges`, `user_badges`, `reports`, `transactions`, `listing_tags`

#### Setting Up the Database

Use the Supabase SQL Editor to create tables or run migrations from `scripts/` folder if available. Key enums used: `user_role` (user/admin), `listing_category` (items/food/services/other), `listing_type` (offer/request), `listing_status` (active/pending/traded/expired).

#### Storage Buckets

Create a storage bucket named `uploads` in Supabase Storage:

1. Go to **Storage** in Supabase dashboard
2. Create new bucket: `uploads`
3. Set it to **Public** (or configure RLS policies)
4. This bucket stores listing images

#### Row Level Security (RLS)

Enable RLS on all tables in Supabase dashboard. Example policies:
- Public can view active listings
- Users can create/update their own listings
- Users can only see their own messages and notifications

#### Authentication Setup

1. **Enable Email/Password authentication** in Supabase Auth settings
2. **Configure OAuth providers:**
   - Enable Google OAuth (add Client ID and Secret)
   - Enable GitHub OAuth (add Client ID and Secret)
3. **Set redirect URLs:**
   - Add `http://localhost:3000/api/auth/callback` for development
   - Add your production URL + `/api/auth/callback` for production

### 4. Running Locally

```bash
# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

The application will be available at `http://localhost:3000`

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── actions/                  # Server Actions
│   │   ├── auth.ts              # Authentication actions
│   │   ├── chat.ts              # Chat/messaging actions
│   │   ├── listings.ts          # Listing CRUD actions
│   │   ├── notifications.ts     # Notification actions
│   │   ├── reviews.ts           # Review actions
│   │   └── security.ts          # Security/moderation actions
│   ├── api/                      # API Routes
│   │   ├── auth/                # Auth endpoints (callback, logout, refresh)
│   │   ├── admin/               # Admin API endpoints
│   │   ├── chat/                # Chat API
│   │   └── listings/            # Listings API
│   ├── auth/                     # Auth pages (login, signup)
│   ├── admin/                    # Admin dashboard
│   ├── chat/                     # Chat interface
│   ├── listings/[id]/           # Listing detail pages
│   ├── create-listing/          # Create listing page
│   ├── favorites/               # User favorites page
│   ├── messages/                # Messages/inbox page
│   ├── notifications/           # Notifications page
│   ├── profile/                 # User profile page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (feed)
│   └── globals.css              # Global styles
│
├── frontend/                     # Frontend-specific code
│   ├── components/              # React components
│   │   ├── chat/               # Chat UI components
│   │   ├── favorites/          # Favorites components
│   │   ├── feed/               # Home feed components
│   │   ├── layout/             # Layout components (Header, Footer, Nav)
│   │   ├── listings/           # Listing components
│   │   ├── notifications/      # Notification components
│   │   └── profile/            # Profile components
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts          # Authentication hook
│   │   └── useImageUpload.ts   # Image upload hook
│   └── lib/
│       └── supabase/
│           └── client.ts        # Browser Supabase client
│
├── backend/                      # Backend-specific code
│   └── lib/
│       └── supabase/
│           └── server.ts        # Server Supabase client
│
├── components/                   # Shared/reusable components
│   ├── reusable-components/    # Generic UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── EmptyState.tsx
│   │   ├── FavoriteToggle.tsx
│   │   ├── card/              # Card components
│   │   └── forms/             # Form components
│   └── notifications/          # Notification UI
│
├── lib/                         # Shared utilities
│   ├── supabase/
│   │   └── client.ts           # Shared Supabase client
│   ├── api/
│   │   └── chatService.ts      # Chat service utilities
│   ├── events/
│   │   └── chatEvents.ts       # Event handling
│   ├── api-client.ts           # API client utilities
│   └── time.ts                 # Time/date utilities
│
├── hooks/                       # Global hooks
│   └── useChatSubscription.ts  # Real-time chat subscription
│
├── types/                       # TypeScript type definitions
│   ├── chat.ts
│   ├── common.ts
│   └── realtime-chat.ts
│
├── middleware/                  # Middleware functions
│   └── api-protection.ts       # API route protection
│
└── middleware.ts                # Next.js middleware (auth, routing)
```

---

## Architecture

### Frontend (Next.js App Router)

Uses **Next.js 15 App Router** with React Server Components for optimal performance. Pages are Server Components by default, interactive components use `"use client"` directive. Server Actions handle data mutations, API Routes handle file uploads.

**Key Pages:** `/` (home feed), `/listings/[id]` (detail), `/create-listing`, `/favorites`, `/messages`, `/chat/[threadId]`, `/profile`, `/admin`

### Backend (Supabase)

- **Database:** PostgreSQL with full-text search and Row Level Security
- **Authentication:** Email/password + OAuth (Google, GitHub), JWT-based sessions
- **Storage:** `uploads` bucket for listing images
- **Realtime:** Chat messages use Supabase Realtime subscriptions

### Authentication System

**Methods Supported:**
- Email/Password authentication
- OAuth (Google, GitHub)
- Session managed via HTTP-only cookies (secure)

**How It Works:**
- Supabase Auth handles all authentication
- Sessions automatically refreshed by middleware
- Protected routes (admin, profile) require authentication
- Admin routes additionally check for admin role (via `ADMIN_EMAILS` env var OR `profiles.role = 'admin'`)

**Key Files:**
- `src/middleware.ts` - Session refresh & route protection
- `src/app/auth/login/page.tsx` - Login page
- `src/app/api/auth/callback/route.ts` - OAuth callback handler
- `src/app/actions/auth.ts` - Auth server actions

### Admin System

**Access Control:**
- Admins defined via `ADMIN_EMAILS` environment variable (comma-separated) OR `role = 'admin'` in `profiles` table
- Middleware automatically enforces admin access

**Admin Features:**
- Approve/reject pending listings
- Manage reviews
- View platform statistics

---

## How The Application Works

This section explains the complete data flow from user interaction through the frontend, backend, API, database, and back to the UI.

### Complete Data Flow Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   Browser   │────▶│   Next.js    │────▶│  Supabase   │────▶│  PostgreSQL  │
│  (React UI) │◀────│  App Router  │◀────│     API     │◀────│   Database   │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────────┘
                           │
                           │
                    ┌──────▼──────┐
                    │   Storage   │
                    │   (Images)  │
                    └─────────────┘
```

---

## Key Features & Flows

### 1. Authentication Flow (Complete)

**Login with Email/Password:**

```
USER ACTION: Enter email & password on /auth/login
   ↓
FRONTEND (login/page.tsx):
   - Form submission captured
   - Calls supabaseBrowser().auth.signInWithPassword()
   ↓
SUPABASE AUTH API:
   - Validates credentials against auth.users table
   - Generates JWT token
   - Creates session
   ↓
RESPONSE TO BROWSER:
   - Session stored in HTTP-only cookies
   - Auth state updated
   ↓
MIDDLEWARE (middleware.ts):
   - Intercepts next request
   - Reads session from cookies
   - Refreshes token if needed
   ↓
FRONTEND:
   - Redirects to home page (/)
   - User is now authenticated
```

**Login with OAuth (Google/GitHub):**

```
USER ACTION: Click "Google" or "GitHub" button
   ↓
FRONTEND (login/page.tsx):
   - Calls supabaseBrowser().auth.signInWithOAuth()
   - Redirects to OAuth provider
   ↓
OAUTH PROVIDER:
   - User authenticates with Google/GitHub
   - Provider redirects back with code
   ↓
CALLBACK ROUTE (/api/auth/callback/route.ts):
   - Receives authorization code
   - Calls supabase.auth.exchangeCodeForSession(code)
   ↓
SUPABASE AUTH:
   - Exchanges code for session
   - Creates/updates user in auth.users
   - Triggers database trigger to create profile
   ↓
DATABASE TRIGGER:
   - Automatically inserts row in profiles table
   - Sets id = auth.users.id
   ↓
CALLBACK ROUTE:
   - Sets session cookies
   - Redirects to home page (/)
   ↓
USER: Now logged in and viewing home page
```

**Session Management:**

```
EVERY PAGE REQUEST:
   ↓
MIDDLEWARE (middleware.ts):
   - Reads cookies
   - Calls supabase.auth.getUser()
   - Refreshes session if expired
   ↓
PROTECTED ROUTES (/admin, /profile, etc.):
   - Middleware checks if user exists
   - If not: redirect to /auth/login
   - If yes: allow access
   ↓
SERVER COMPONENTS:
   - Call supabaseServer() to get authenticated client
   - Access user data: const { data: { user } } = await supabase.auth.getUser()
```

---

### 2. Listing Creation Flow (Complete)

```
USER ACTION: Navigate to /create-listing
   ↓
FRONTEND (CreateListingForm.tsx):
   - Renders 3-step form
   - Step 1: Title, description, category, type, is_urgent
   - Step 2: City, area, location
   - Step 3: Image upload (up to 6 images)
   ↓
USER ACTION: Select images from device
   ↓
FRONTEND:
   - Store files in local state: setImages([file1, file2, ...])
   - Generate preview URLs: URL.createObjectURL(file)
   - Display previews to user
   ↓
USER ACTION: Click "Create Listing"
   ↓
FRONTEND (uploadImages function):
   - Loop through each image file
   - Create FormData for each image
   - POST to /api/auth/upload-image
   ↓
API ROUTE (/api/auth/upload-image/route.ts):
   - Receives FormData with image file
   - Validates user is authenticated
   - Generates unique filename (timestamp + random)
   - Uploads to Supabase Storage bucket "uploads"
   ↓
SUPABASE STORAGE:
   - Stores image in "uploads" bucket
   - Returns public URL and file path
   ↓
API ROUTE:
   - Returns JSON: { url: "https://...", path: "..." }
   ↓
FRONTEND:
   - Collects all uploaded image URLs
   - Formats as: [{ image_url, path, position: 1 }, ...]
   ↓
FRONTEND:
   - Calls createListingAndRedirect() server action
   - Passes form data + images array
   ↓
SERVER ACTION (actions/listings.ts):
   - Gets authenticated user: supabase.auth.getUser()
   - Inserts into "listings" table:
     * owner_id = current user
     * status = "pending" (awaiting admin approval)
     * All form fields (title, description, category, etc.)
   ↓
DATABASE (listings table):
   - Row inserted with auto-generated UUID
   - Returns inserted listing data
   ↓
SERVER ACTION:
   - Inserts into "listing_images" table:
     * listing_id = newly created listing
     * image_url, path, position for each image
   ↓
DATABASE (listing_images table):
   - Multiple rows inserted (one per image)
   ↓
SERVER ACTION:
   - Calls createNotification() for user:
     * type: "listing_created"
     * title: "Listing Created"
     * message: "Your listing has been created successfully"
   ↓
DATABASE (notifications table):
   - Notification row inserted
   ↓
SERVER ACTION:
   - Calls revalidatePath("/") to refresh home page cache
   - Calls redirect("/") to navigate user
   ↓
FRONTEND:
   - User redirected to home page
   - Sees success (listing pending admin approval)
   ↓
ADMIN APPROVAL:
   - Admin views /admin/listings
   - Sees listing with status="pending"
   - Clicks "Approve"
   ↓
SERVER ACTION (updateListingStatus):
   - Updates listing: status = "active"
   - Revalidates cache
   ↓
DATABASE:
   - Listing status changed to "active"
   ↓
HOME PAGE (/):
   - Listing now appears in public feed
   - Other users can see and interact with it
```

---

### 3. Chat/Messaging Flow (Complete)

```
USER ACTION: Click "Message" button on a listing
   ↓
FRONTEND (ContactOwnerButton.tsx):
   - Gets listing owner's ID
   - Calls createOrGetChatThread(listingId, ownerUserId)
   ↓
SERVER ACTION (actions/chat.ts):
   - Gets current authenticated user
   - Searches for existing thread between these 2 users:
     1. Get all threads where current user is participant
     2. Check if other user is also in any of those threads
   ↓
DATABASE QUERY (chat_participants):
   - SELECT thread_id WHERE user_id = currentUser
   - Then: SELECT * WHERE thread_id IN (...) AND user_id = otherUser
   ↓
IF THREAD EXISTS:
   - Return existing thread
   - Set isNew = false
   ↓
IF NO THREAD:
   - Insert into chat_threads:
     * thread_type = "direct"
     * listing_id = original listing (for context)
     * created_by = current user
   - Insert into chat_participants (2 rows):
     * Row 1: thread_id, user_id = current user
     * Row 2: thread_id, user_id = other user
   - Return new thread, isNew = true
   ↓
SERVER ACTION:
   - Returns thread data to frontend
   ↓
FRONTEND:
   - Redirects to /chat/[threadId]
   ↓
CHAT PAGE (/chat/[threadId]/page.tsx):
   - Calls getThreadMessages(threadId) to load history
   ↓
SERVER ACTION:
   - Validates user is a participant
   - Fetches messages from database:
     * JOIN with profiles to get sender info
     * ORDER BY created_at ASC
   ↓
DATABASE (messages table):
   - Returns all messages with sender profiles
   ↓
FRONTEND (ChatThread.tsx):
   - Displays message history
   - Subscribes to real-time updates via useChatSubscription
   ↓
REALTIME SUBSCRIPTION (hooks/useChatSubscription.ts):
   - Connects to Supabase Realtime
   - Listens to INSERT events on messages table
   - Filters: thread_id = current thread
   ↓
USER ACTION: Type message and press Send
   ↓
FRONTEND:
   - Calls sendMessage(threadId, content)
   ↓
SERVER ACTION (actions/chat.ts):
   - Validates user is participant
   - Inserts into messages table:
     * thread_id
     * sender_id = current user
     * content = message text
     * status = "sent"
   ↓
DATABASE (messages table):
   - Message row inserted
   ↓
DATABASE TRIGGER (or server action):
   - Updates chat_threads.last_message_at = NOW()
   ↓
SUPABASE REALTIME:
   - Broadcasts INSERT event to all subscribers
   ↓
OTHER USER'S BROWSER (if online):
   - useChatSubscription receives event
   - Automatically adds new message to UI
   - No page refresh needed!
   ↓
BOTH USERS:
   - See message in real-time
   - Chat is synchronized
```

**Mark as Read Flow:**

```
USER ACTION: Open chat thread
   ↓
FRONTEND (ChatThread.tsx):
   - useEffect triggers on mount
   - Calls markMessagesAsRead(threadId)
   ↓
SERVER ACTION (actions/chat.ts):
   - Updates messages table:
     * WHERE thread_id = threadId
     * AND sender_id != current user
     * AND status != "read"
   - SET status = "read"
   ↓
DATABASE:
   - All unread messages marked as read
   ↓
NOTIFICATION BELL:
   - Unread count decreases
   - Badge updates automatically
```

---

### 4. Favorites Flow

```
USER ACTION: Click heart icon on listing card
   ↓
FRONTEND (FavoriteToggle.tsx):
   - Calls toggleFavorite(listingId)
   ↓
SERVER ACTION (actions/listings.ts):
   - Gets current user
   - Checks if favorite exists:
     * SELECT * FROM favorites WHERE user_id = ? AND listing_id = ?
   ↓
DATABASE QUERY:
   - Returns existing favorite or null
   ↓
IF FAVORITE EXISTS:
   - DELETE FROM favorites WHERE user_id = ? AND listing_id = ?
   - Return { favorited: false }
   ↓
IF FAVORITE DOESN'T EXIST:
   - INSERT INTO favorites (user_id, listing_id)
   - Return { favorited: true }
   ↓
SERVER ACTION:
   - Calls revalidatePath("/") and revalidatePath("/listings/[id]")
   - Returns result
   ↓
FRONTEND:
   - Heart icon updates immediately (filled/unfilled)
   - Optimistic UI update
   ↓
DATABASE:
   - Change persisted
   ↓
FAVORITES PAGE (/favorites):
   - When user visits, shows all favorited listings
   - Query: SELECT listings WHERE id IN (SELECT listing_id FROM favorites WHERE user_id = ?)
```

---

### 5. Review & Rating Flow

```
USER ACTION: Submit review on user profile
   ↓
FRONTEND (Review form component):
   - Calls createReview() server action
   - Passes: reviewed_user_id, rating (1-5), comment, listing_id
   ↓
SERVER ACTION (actions/reviews.ts):
   - Validates user is authenticated
   - Inserts into reviews table:
     * reviewer_id = current user
     * reviewed_user_id = target user
     * rating, comment
     * listing_id (optional - context)
   ↓
DATABASE (reviews table):
   - Review inserted
   ↓
DATABASE TRIGGER (or server action):
   - Recalculates average rating for reviewed user:
     * AVG(rating) FROM reviews WHERE reviewed_user_id = ?
   - Updates profiles table:
     * rating = calculated average
     * rating_count = COUNT(reviews)
   ↓
DATABASE (profiles table):
   - User's rating updated
   ↓
SERVER ACTION:
   - Revalidates user profile page
   ↓
PROFILE PAGE:
   - Updated rating appears immediately
   - Star rating component shows new average
```

---

### 6. Admin Approval Flow

```
ADMIN: Navigates to /admin/listings
   ↓
MIDDLEWARE (middleware.ts):
   - Checks if user email in ADMIN_EMAILS env var
   - OR checks if profiles.role = "admin"
   - If not: redirect to / or return 403
   ↓
ADMIN PAGE (/admin/listings/page.tsx):
   - Calls getPendingListings() server action
   ↓
SERVER ACTION (actions/listings.ts):
   - Calls checkIsAdmin() for double-check
   - Queries: SELECT * FROM listings WHERE status = "pending"
   ↓
DATABASE:
   - Returns all pending listings
   ↓
ADMIN UI:
   - Displays table of pending listings
   - Shows thumbnail, title, owner, date
   ↓
ADMIN ACTION: Click "Approve" button
   ↓
FRONTEND:
   - Calls updateListingStatus(listingId, "active")
   ↓
SERVER ACTION (actions/listings.ts):
   - Validates admin permission
   - Updates: SET status = "active" WHERE id = listingId
   ↓
DATABASE (listings table):
   - Status changed to "active"
   ↓
SERVER ACTION:
   - Revalidates: "/", "/admin", "/listings/[id]"
   ↓
HOME PAGE (/):
   - Listing now appears in public feed
   - Other users can see it
   ↓
OWNER:
   - May receive notification (if implemented)
   - Listing visible on their profile
```

---

### 7. Notification System Flow

```
TRIGGER EVENT: (e.g., listing created, message received, review received)
   ↓
SERVER ACTION or API ROUTE:
   - Calls createNotification() helper
   - Passes: userId, type, title, message, data, actionUrl
   ↓
SERVER ACTION (actions/notifications.ts):
   - Inserts into notifications table:
     * user_id
     * type (listing_created, new_message, review_received)
     * title, message
     * data (JSON with extra info)
     * is_read = false
     * action_url (where to navigate on click)
   ↓
DATABASE (notifications table):
   - Notification row created
   ↓
HEADER COMPONENT (NotificationBell.tsx):
   - Periodically or on mount: fetches unread count
   - Query: SELECT COUNT(*) FROM notifications WHERE user_id = ? AND is_read = false
   ↓
DATABASE:
   - Returns unread count
   ↓
FRONTEND:
   - Badge shows number (e.g., "3")
   - Red dot or number indicator
   ↓
USER ACTION: Click notification bell
   ↓
FRONTEND:
   - Opens dropdown or navigates to /notifications
   - Fetches notifications: getNotifications()
   ↓
SERVER ACTION:
   - SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 10
   ↓
DATABASE:
   - Returns recent notifications
   ↓
FRONTEND (NotificationList.tsx):
   - Displays list with icons, titles, messages
   - Each notification has "Mark as Read" or auto-marks on view
   ↓
USER ACTION: Click on a notification
   ↓
FRONTEND:
   - Calls markNotificationAsRead(notificationId)
   - Navigates to notification.action_url
   ↓
SERVER ACTION:
   - UPDATE notifications SET is_read = true WHERE id = ?
   ↓
DATABASE:
   - Notification marked as read
   ↓
NOTIFICATION BELL:
   - Unread count decreases
```

---

## Data Flow Summary

**Every feature follows this pattern:**

1. **USER INTERACTION** → Frontend React component
2. **FRONTEND** → Calls Server Action or API route
3. **SERVER** → Validates auth, processes logic
4. **DATABASE** → Data stored/retrieved in PostgreSQL
5. **SERVER** → Returns response
6. **FRONTEND** → Updates UI based on response
7. **CACHE** → Revalidated with `revalidatePath()`

**Key Technologies in Each Layer:**

- **Frontend:** React 19, Next.js App Router, TypeScript
- **Server:** Next.js Server Actions, API Routes
- **Auth:** Supabase Auth (JWT tokens in HTTP-only cookies)
- **Database:** PostgreSQL (via Supabase)
- **Storage:** Supabase Storage (for images)
- **Realtime:** Supabase Realtime (for chat)
- **Caching:** Next.js built-in cache + revalidation

### 8. Search & Filtering

**Search Implementation:**
- Full-text search using PostgreSQL `tsvector`
- Search vector includes title and description
- Indexed with GIN index for performance
- Filters: category, type (offer/request), location

---

## Technical Implementation Summary

### Frontend → Backend Communication

**Pattern 1: Server Actions (Preferred)**
```typescript
// Frontend (Client Component)
"use client";
import { createListing } from "@/app/actions/listings";

async function handleSubmit(data) {
  const result = await createListing(data);
  if (result.error) {
    // Handle error
  } else {
    // Success
  }
}
```

**Pattern 2: API Routes (For Uploads/External APIs)**
```typescript
// Frontend
const formData = new FormData();
formData.append("file", file);
const res = await fetch("/api/auth/upload-image", {
  method: "POST",
  body: formData
});
```

### Backend → Database Communication

**Using Supabase Client:**
```typescript
// Server Action or API Route
import { supabaseServer } from "@/backend/lib/supabase/server";

const supabase = await supabaseServer();
const { data, error } = await supabase
  .from("listings")
  .select("*")
  .eq("status", "active");
```

### Real-time Updates

**Supabase Realtime Subscription:**
```typescript
// Frontend Hook
const supabase = createClient();
const channel = supabase
  .channel("messages")
  .on("postgres_changes", {
    event: "INSERT",
    schema: "public",
    table: "messages",
    filter: `thread_id=eq.${threadId}`
  }, (payload) => {
    // Add new message to UI
  })
  .subscribe();
```

---

## Development Guidelines

**Code Organization:**
- Server Actions in `app/actions/` with `"use server"` directive
- Shared components in `components/`, feature-specific in `frontend/components/[feature]/`
- Types in `types/` directory

**Styling:**
- Tailwind CSS for all styling, mobile-first responsive design

**Error Handling:**
- Server actions return `{ success, data, error }` objects
- Display errors in UI with `bg-red-50 text-red-700`

**Data Fetching:**
- Server Components fetch with `supabaseServer()`
- Client Components use `supabaseBrowser()`
- Use `revalidatePath()` after mutations

---

## Deployment

### Environment Variables for Production

Ensure these are set in your deployment platform:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-production-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-production-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-production-service-role-key>
SUPABASE_JWT_SECRET=<your-production-jwt-secret>
ADMIN_EMAILS=<comma-separated-admin-emails>
```

### Build Process

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Deployment Platforms

**Recommended:** Vercel (seamless Next.js integration)

1. **Connect GitHub repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** automatically on push to main branch

**Alternative:** Any Node.js hosting platform (Railway, Render, DigitalOcean, AWS)

### Supabase Configuration for Production

1. **Update OAuth redirect URLs:**
   - Add production domain + `/api/auth/callback`
   - Example: `https://yourdomain.com/api/auth/callback`

2. **Configure CORS** (if using custom domain):
   - Add your domain to Supabase allowed origins

3. **Review RLS Policies:**
   - Ensure policies are properly configured for production data

4. **Database Backups:**
   - Enable automatic backups in Supabase project settings

---

## Troubleshooting

### Common Issues

**Issue:** "Invalid API key" error
- **Solution:** Check that environment variables are correctly set and match your Supabase project

**Issue:** OAuth redirect not working
- **Solution:** Ensure callback URL is added to Supabase Auth settings and matches exactly

**Issue:** Images not uploading
- **Solution:** 
  - Check that `uploads` storage bucket exists
  - Verify bucket permissions (public or appropriate RLS policies)
  - Check file size limits

**Issue:** Chat messages not appearing in real-time
- **Solution:**
  - Verify Realtime is enabled in Supabase project settings
  - Check browser console for subscription errors
  - Ensure RLS policies allow reading messages

**Issue:** Admin routes showing "Forbidden"
- **Solution:**
  - Verify email is in `ADMIN_EMAILS` environment variable
  - OR check that user's `role` in database is `'admin'`
  - Clear cookies and log in again

**Issue:** Database queries failing
- **Solution:**
  - Check RLS policies are configured correctly
  - Verify foreign key relationships
  - Check Supabase logs for detailed error messages

### Development Tips

- Use `console.log` liberally in development to debug server actions
- Check Supabase logs for database errors (Project Settings → Logs)
- Use React DevTools to inspect component state
- Test auth flows in incognito mode to avoid session conflicts
- Use Supabase Table Editor to manually inspect/modify data during development

---

## Contact & Support

For questions or issues:
1. Check this documentation
2. Review Supabase project logs
3. Contact the development team

---

**Last Updated:** December 2025