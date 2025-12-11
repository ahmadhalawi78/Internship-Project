# User Profile Components

This directory contains all the components for the user profile section of LoopLebanon.

## Components

### UserProfile
Main container component that combines all profile sections.

**Props:**
- `user: ProfileUser` - User object with id, email, and metadata
- `location?: string` - User's location
- `stats?: { listings: number; reviews: number; joined: string }` - User statistics

**Usage:**
```tsx
<UserProfile
  user={{
    id: "user-123",
    email: "user@example.com",
    user_metadata: { name: "John Doe", avatar_url: "..." }
  }}
  location="Beirut, Lebanon"
  stats={{ listings: 8, reviews: 5, joined: "2 years" }}
/>
```

### ProfileHeader
Displays user avatar, name, location, and statistics.

**Features:**
- Responsive avatar with edit button on hover
- User name and location display
- Statistics cards (listings, reviews, join date)
- Edit profile button
- Mobile-optimized layout

**Props:**
- `user: ProfileUser` - User object
- `stats?: object` - User statistics
- `location?: string` - User location
- `onEditClick?: () => void` - Callback when edit button is clicked

### ProfileSections
Tabbed interface for different profile sections.

**Sections:**
1. **Listings** - Grid of user's listings with action buttons
2. **Favorites** - User's saved/favorited items
3. **Reviews** - User reviews with ratings
4. **Messages** - User's recent conversations

**Features:**
- Tab navigation with badges
- Responsive grid layout for listings
- Review cards with star ratings
- Message previews with timestamps
- Action buttons (share, delete, etc.)

**Props:**
- `userId: string` - User ID
- `activeTab?: string` - Initial active tab (default: "listings")
- `onTabChange?: (tabId: string) => void` - Tab change callback

### EditProfileModal
Modal dialog for editing user profile information.

**Fields:**
- Bio (160 character limit)
- Website URL
- Phone number
- Language selection (EN, AR, FR)
- Profile privacy (Public/Private)
- Email notifications toggle

**Features:**
- Form validation
- Character counter for bio
- Loading state during save
- Cancel/Save buttons
- Responsive design

**Props:**
- `isOpen: boolean` - Modal open state
- `onClose: () => void` - Close callback
- `onSave?: (info: ProfileInfo) => void` - Save callback
- `initialData?: ProfileInfo` - Pre-filled form data

## Page Route

Profile page is available at `/profile` and requires authentication.

**Location:** `src/app/profile/page.tsx`

## Styling

All components use:
- Tailwind CSS for styling
- Responsive breakpoints (xs, sm, md, lg)
- Consistent color scheme (blue/emerald)
- Smooth transitions and hover states

## Accessibility

- Proper semantic HTML
- ARIA labels on buttons
- Keyboard navigation support
- Focus states on interactive elements
- Alt text on images

## Future Enhancements

- [ ] Integrate with Supabase for real data
- [ ] Add image upload for avatar
- [ ] Implement profile completion progress
- [ ] Add verification badge support
- [ ] Social sharing features
- [ ] Advanced filtering in listings tab
