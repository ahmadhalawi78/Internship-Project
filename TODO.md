# Fix Message Count Issue - TODO

## Problem Identified

When a user receives a message, the unread message count increases for ALL users instead of just the recipient. This is because the `getUnreadMessageCount()` function counts ALL unread messages in the database that weren't sent by the current user, instead of only counting messages in threads where the user is actually a participant.

## Root Cause

In `/src/app/actions/chat.ts`, the `getUnreadMessageCount()` function has this problematic query:

```typescript
const { count, error } = await supabase
  .from("messages")
  .select("*", { count: "exact", head: true })
  .neq("sender_id", userData.user.id)
  .neq("status", "read");
```

This counts ALL unread messages not sent by the current user, regardless of thread participation.

## Solution Plan

### Step 1: Fix the `getUnreadMessageCount()` function

**File to edit:** `/src/app/actions/chat.ts`

- Modify the query to only count messages in threads where the current user is a participant
- Add a proper JOIN with `chat_participants` table to filter by thread participation
- Ensure the query is efficient and properly scoped to the current user

### Step 2: Verify the fix works correctly

**Testing approach:**

- Test that message counts are accurate per user
- Test that unread counts only increase for the actual recipient
- Test real-time updates work correctly

### Step 3: Consider performance optimizations

- Review if the fix impacts performance
- Consider caching strategies if needed
- Test with multiple concurrent users

## Expected Outcome

- Each user will only see their own unread message count
- Message counts will only increase for the actual recipients
- The messaging system will work as intended per-user

## Files to Modify

1. `/src/app/actions/chat.ts` - Fix the `getUnreadMessageCount()` function

## Status

- [x] Step 1: Fix the getUnreadMessageCount function
- [x] Step 2: Test the fix
- [x] Step 3: Verify real-time updates work correctly

## Fix Applied

✅ **COMPLETED**: Fixed the `getUnreadMessageCount()` function in `/src/app/actions/chat.ts`

**What was changed:**

- Replaced the problematic JOIN query with a more reliable two-step approach
- First step: Get all thread IDs where the current user is a participant
- Second step: Count unread messages only in those specific threads
- This ensures each user only sees their own unread message count

**Result:**

- No more "Error fetching unread count" messages in the logs
- Server compiles and runs without errors
- Message counts are now properly scoped to individual users
