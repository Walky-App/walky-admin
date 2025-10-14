# Role-Based Access Control (RBAC) Implementation

## Overview
This document describes the complete Role-Based Access Control (RBAC) implementation for the Walky Admin Panel. The implementation ensures that users can only access features and pages appropriate for their assigned role.

## Role Hierarchy

The system implements the following role hierarchy (from highest to lowest privilege):

1. **super_admin** - Full system access, can manage all campuses and users
2. **campus_admin** - Campus-level administration, moderation, and user management
3. **editor** - Content editing and campus staff functions
4. **moderator** - Moderation and campus staff functions
5. **staff** - Campus staff functions (analytics, student management, events)
6. **viewer** - Read-only access to basic dashboard and settings

**Note:** Students, faculty, and parents are blocked from accessing the admin panel entirely.

## Implementation Components

### 1. useAuth Hook (`src/hooks/useAuth.ts`)

Provides centralized authentication state management:

```typescript
const { user, isAuthenticated, isLoading, hasRole, isSuperAdmin, isCampusAdmin } = useAuth();
```

**Features:**
- Reads user data from localStorage
- Provides role checking utilities
- Handles authentication state
- Manages loading states

### 2. RoleProtectedRoute Component (`src/components/RoleProtectedRoute.tsx`)

Wraps routes to enforce role-based access:

```typescript
<RoleProtectedRoute allowedRoles={['super_admin', 'campus_admin']}>
  <YourComponent />
</RoleProtectedRoute>
```

**Behavior:**
- Shows loading spinner during auth check
- Redirects to `/login` if not authenticated
- Redirects to `/unauthorized` if wrong role
- Logs access denials for debugging

### 3. Unauthorized Page (`src/pages/Unauthorized.tsx`)

User-friendly access denied page with:
- Clear error messaging
- Navigation to dashboard
- Go back button
- Consistent CoreUI styling

## Route Permissions

### Public Routes
- `/login` - Login page
- `/create-account` - Account creation
- `/forgot-password` - Password reset
- `/verify-code` - Email verification
- `/unauthorized` - Access denied page

### Protected Routes

#### All Admin Roles
- `/` - Dashboard
- `/settings` - General Settings
- `/admin-settings` - Admin Settings

#### Staff and Above
- `/students` - Student Management
- `/student-management` - Advanced Student Management
- `/engagement` - Engagement Metrics
- `/events-activities` - Events & Activities Dashboard
- `/social-health` - Social Health Overview
- `/wellbeing-stats` - Wellbeing Statistics

#### Campus Admin and Above
- `/campuses` - Campus Management
- `/campus-details/:id` - Campus Details
- `/campus-boundary` - Campus Boundary Configuration
- `/campus-analytics/:campusId` - Campus Analytics
- `/ambassadors` - Ambassador Management
- `/reports` - Reports & Safety
- `/reports/:id` - Report Details
- `/banned-users` - Banned Users Management
- `/locked-users` - Locked Users Management

#### Super Admin Only
- `/campus-sync` - Campus Synchronization
- `/roles` - Roles & Permissions Management
- `/users-roles` - Users & Roles Assignment

## Sidebar Navigation

The sidebar navigation (`src/components/NavSideBar.tsx`) dynamically shows/hides menu items based on user role:

### Menu Visibility Rules

**Dashboard Section** (All roles)
- Dashboard

**CAMPUS Section** (Staff and above)
- Students
- Engagement

**ANALYTICS Section** (Staff and above)
- Social Health
- Student Management
- Events & Activities
- Wellbeing Stats

**ADMIN Section**
- Campuses (Campus Admin and above)
- Ambassadors (Campus Admin and above)
- Campus Sync (Super Admin only)
- Roles & Permissions (Super Admin only)
- Users & Roles (Super Admin only)

**MODERATION Section** (Campus Admin and above)
- Reports & Safety
- Banned Users
- Locked Users

**SETTINGS Section** (All roles)
- Admin Settings
- General Settings

## Login Validation

The login process (`src/pages/Login.tsx`) includes role validation:

1. User authenticates with email/password
2. Backend returns user data including role
3. Frontend validates role is an admin role
4. Non-admin users (students, faculty, parents) are blocked with error message
5. User data and token stored in localStorage
6. User redirected to dashboard

**Blocked Roles:**
- student
- faculty
- parent

**Allowed Roles:**
- super_admin
- campus_admin
- editor
- moderator
- staff
- viewer

## Security Features

### Multi-Layer Protection

1. **Login Layer** - Blocks non-admin users at login
2. **Route Layer** - Redirects unauthorized users trying to access protected routes
3. **UI Layer** - Hides menu items user cannot access
4. **Backend Layer** - Backend RBAC should also validate (defense in depth)

### Access Denial Logging

All access denials are logged to console with:
- User role
- Attempted route/feature
- Allowed roles

Example:
```
⚠️ Access denied: User role "staff" not in allowed roles: ["super_admin", "campus_admin"]
```

## Testing RBAC

### Test Scenarios

1. **Super Admin Access**
   - Should see all menu items
   - Should access all routes
   - Should see super admin-only features

2. **Campus Admin Access**
   - Should see all except super admin items
   - Should NOT access `/campus-sync`, `/roles`, `/users-roles`
   - Should access moderation and campus management

3. **Staff Access**
   - Should see CAMPUS, ANALYTICS, SETTINGS sections only
   - Should NOT access ADMIN or MODERATION sections
   - Should NOT access `/campuses`, `/reports`, `/ambassadors`

4. **Viewer Access**
   - Should see Dashboard and Settings only
   - Should NOT access any management features

5. **Non-Admin Users**
   - Should be blocked at login with error message
   - Should NOT be able to access any admin routes

### Manual Testing Steps

1. Create test users with different roles in the backend
2. Login with each role
3. Verify sidebar shows correct menu items
4. Try accessing restricted routes directly via URL
5. Verify appropriate redirects occur
6. Check console for access denial logs

## Future Enhancements

### Recommended Improvements

1. **Action-Level Permissions**
   - Add role checks to individual buttons (Create, Delete, Ban, etc.)
   - Use `useAuth` hook in page components
   - Hide/disable actions user cannot perform

2. **Campus-Scoped Data**
   - Filter data by user's campus_id for campus_admin role
   - Ensure campus_admin only sees their campus data
   - Add campus filtering to API calls

3. **Audit Logging**
   - Log all access attempts (successful and failed)
   - Track user actions for compliance
   - Create audit trail for sensitive operations

4. **Permission System**
   - Move from role-based to permission-based
   - Allow fine-grained permission assignment
   - Support custom role creation

5. **Session Management**
   - Add automatic token refresh
   - Implement session timeout
   - Add "Remember Me" functionality

## Maintenance

### Adding New Routes

When adding a new protected route:

1. Define appropriate `allowedRoles` array
2. Wrap route with `RoleProtectedRoute` in `App.tsx`
3. Add menu item to `NavSideBar.tsx` with role condition
4. Update this documentation

Example:
```typescript
// In App.tsx
<Route
  path="/new-feature"
  element={
    <RoleProtectedRoute allowedRoles={CAMPUS_ADMIN_AND_ABOVE}>
      <NewFeature />
    </RoleProtectedRoute>
  }
/>

// In NavSideBar.tsx
{isCampusAdminOrAbove && (
  <CNavItem className="px-3 py-2">
    <NavLink to="/new-feature">
      New Feature
    </NavLink>
  </CNavItem>
)}
```

### Modifying Role Permissions

To change which roles can access a feature:

1. Update `allowedRoles` array in `App.tsx` route definition
2. Update visibility condition in `NavSideBar.tsx`
3. Test with affected roles
4. Update this documentation

## Troubleshooting

### Common Issues

**Issue: User redirected to unauthorized page immediately**
- Check localStorage has valid user data
- Verify user role is in allowedRoles array
- Check browser console for access denial log

**Issue: Menu items not showing**
- Verify user data loaded (check useAuth isLoading)
- Check role checking logic in NavSideBar
- Verify user role matches visibility conditions

**Issue: Can access route but menu item hidden**
- Mismatch between route allowedRoles and sidebar condition
- Update sidebar visibility to match route permissions

**Issue: Login fails for valid admin user**
- Check user role is in adminRoles array in Login.tsx
- Verify backend returns correct role in response
- Check console for role validation errors

## Support

For questions or issues with RBAC implementation:
1. Check console logs for detailed error messages
2. Verify user data in localStorage
3. Review role hierarchy in this document
4. Check route definitions in App.tsx
5. Contact development team if issue persists
