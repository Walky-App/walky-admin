# School Selection System

This system implements a school selection flow for admin users (Role: "7891"). When an admin logs in, they must select a school before accessing the dashboard.

## Components Created

### 1. Role Enum (`src/types/Role.ts`)

```typescript
export enum Role {
  ADMIN = "7891",
  STUDENT = "2356",
  FACULTY = "6473",
}
```

### 2. School Selection Page (`src/pages/SchoolSelection.tsx`)

- Displays a list of all available schools
- Fetches schools from `/api/schools` endpoint
- Allows admin to select a school
- Stores selected school in localStorage
- Redirects to admin dashboard after selection

### 3. School Service (`src/services/schoolService.ts`)

- Handles all school-related API calls
- Manages selected school state in localStorage
- Methods:
  - `getAllSchools()` - Fetches all schools
  - `getSchoolById(id)` - Fetches specific school details
  - `getSelectedSchool()` - Gets selected school ID
  - `setSelectedSchool(id, name)` - Sets selected school
  - `clearSelectedSchool()` - Clears selected school

### 4. Admin School Guard (`src/components/AdminSchoolGuard.tsx`)

- Protects routes that require school selection
- Redirects admins to school selection if no school is selected
- Allows other roles to pass through

### 5. useSelectedSchool Hook (`src/hooks/useSelectedSchool.ts`)

- Custom hook for managing selected school state
- Returns:
  - `selectedSchoolId` - ID of selected school
  - `selectedSchoolName` - Name of selected school
  - `selectedSchool` - Full school object
  - `hasSelectedSchool` - Boolean if school is selected
  - `requiresSchoolSelection` - Boolean if admin needs to select school
  - `selectSchool(id, name)` - Function to select school
  - `clearSchool()` - Function to clear selection

### 6. Updated Auth Context (`src/contexts/AuthContext.tsx`)

- Provides user authentication state
- Stores user role in localStorage
- Clears selected school on logout

### 7. User Role Utilities (`src/utils/UserRole.ts`)

- Helper functions for checking user roles
- `getCurrentUserRole()` - Gets current user's role
- `isAdmin()`, `isFaculty()`, `isStudent()` - Role checking helpers

## Usage in Your App

### 1. Wrap your app with AuthProvider

```typescript
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return <AuthProvider>{/* Your app content */}</AuthProvider>;
}
```

### 2. Use the AdminSchoolGuard

The guard is already integrated into the routing in App.tsx. It will:

- Redirect admins to `/school-selection` if no school is selected
- Allow access to protected routes once school is selected

### 3. Check selected school in components

```typescript
import { useSelectedSchool } from "../hooks/useSelectedSchool";

function MyComponent() {
  const { selectedSchoolName, hasSelectedSchool } = useSelectedSchool();

  return (
    <div>
      {hasSelectedSchool && <p>Current school: {selectedSchoolName}</p>}
    </div>
  );
}
```

## API Endpoints Required

### 1. Get All Schools

```
GET /api/schools
Authorization: Bearer <token>

Response:
{
  "schools": [
    {
      "id": "school1",
      "name": "University A",
      "address": "123 Main St",
      "city": "City",
      "state": "State"
    }
  ]
}
```

### 2. Get School by ID

```
GET /api/schools/:id
Authorization: Bearer <token>

Response:
{
  "id": "school1",
  "name": "University A",
  "address": "123 Main St",
  "city": "City",
  "state": "State"
}
```

## Flow

1. User logs in with admin role (7891)
2. After login, they are redirected to `/school-selection`
3. School selection page fetches all schools from API
4. Admin selects a school
5. Selected school is stored in localStorage
6. Admin is redirected to dashboard
7. AdminSchoolGuard ensures school is selected for all protected routes
8. If admin logs out, selected school is cleared

## Error Handling

- If API calls fail, error messages are displayed
- If admin tries to access protected routes without selecting a school, they are redirected to school selection
- 404 page handles invalid routes and provides proper navigation based on user state

## Notes

- The school selection is only required for admin users (Role.ADMIN = "7891")
- Students and faculty bypass the school selection flow
- Selected school persists across browser sessions via localStorage
- The system is designed to be flexible and can be extended with additional school-related features
