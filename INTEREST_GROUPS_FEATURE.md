# Interest Groups Admin Feature

## Overview
The Interest Groups management feature allows administrators to organize interests into customizable groups with full control over ordering and membership.

## Features Implemented

### 1. Interest Groups Page (`/interest-groups`)
- **Full CRUD Operations**: Create, Read, Update, Delete interest groups
- **Drag-and-Drop Reordering**: Easily reorder groups by dragging them
- **Expandable Groups**: Click to expand and see interests within each group
- **Search Functionality**: Filter groups by name

### 2. Group Management
- **Create New Groups**: Add new interest groups with custom names and order
- **Edit Groups**: Modify group names and display order
- **Delete Groups**: Soft delete groups (can be recovered from database)
- **Active/Inactive Status**: Toggle group visibility

### 3. Interest Assignment
- **Manage Interests Modal**: Add or remove interests from groups
- **Visual Interest Display**: Shows interest icons and names
- **Order Within Groups**: Interests are ordered within each group
- **Multiple Groups**: One interest can belong to multiple groups

### 4. User Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Visual Feedback**: Loading states, error handling, success messages
- **Intuitive Controls**: Clear buttons and actions
- **Collapsible Views**: Expand/collapse groups to see their contents

## How to Use

### Creating a New Group
1. Click "Add New Group" button
2. Enter group name
3. Set display order (lower numbers appear first)
4. Click "Save"

### Reordering Groups
1. Click and hold the drag handle (⋮) on the left of any group
2. Drag the group to its new position
3. Release to drop - the order is saved automatically

### Managing Interests in a Group
1. Click the list icon (☰) on any group
2. In the modal:
   - **Left side**: Available interests not in the group
   - **Right side**: Interests currently in the group
3. Click (+) to add an interest to the group
4. Click (×) to remove an interest from the group
5. Changes are saved automatically

### Editing a Group
1. Click the pencil icon (✏️) on any group
2. Modify the name or order
3. Click "Save"

### Deleting a Group
1. Click the trash icon (🗑️) on any group
2. Confirm the deletion in the modal
3. The group is soft-deleted (can be recovered from database if needed)

## API Endpoints Used

- `GET /api/interest-groups` - Fetch all groups
- `POST /api/interest-groups` - Create new group
- `PUT /api/interest-groups/:id` - Update group
- `DELETE /api/interest-groups/:id` - Delete group
- `PUT /api/interest-groups/reorder` - Reorder groups
- `POST /api/interest-groups/:id/interests` - Add interest to group
- `DELETE /api/interest-groups/:id/interests/:interestId` - Remove interest from group

## Technical Implementation

### Technologies Used
- **React** with TypeScript
- **CoreUI** for UI components
- **@dnd-kit** for drag-and-drop functionality
- **React Query** for data fetching and caching
- **Axios** for API calls

### Key Components
- `InterestGroups.tsx` - Main page component
- `interestGroupService.ts` - API service layer
- `interestGroup.ts` - TypeScript type definitions

## Database Structure

```typescript
InterestGroup {
  _id: string
  name: string
  order: number
  interests: [{
    interestId: ObjectId (ref: Interest)
    order: number
  }]
  is_active: boolean
  is_delete: boolean
  created_by: string
  createdAt: Date
  updatedAt: Date
}
```

## Benefits
1. **Dynamic Management**: No code changes needed to reorganize interests
2. **Better UX**: Users see interests in logical groups
3. **Flexibility**: Interests can appear in multiple groups
4. **Performance**: Optimized queries with proper indexing
5. **Admin Control**: Full control through the dashboard

## Navigation
Access the features through the admin dashboard:
- **Interests** - Manage individual interests
- **Interest Groups** - Manage groups and their organization