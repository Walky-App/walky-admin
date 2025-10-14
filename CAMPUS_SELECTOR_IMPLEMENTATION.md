# Campus Selector Implementation

## Overview
This document describes the Campus Selector feature that allows super admins to filter data by campus/university in the admin panel. Campus admins and staff see only their assigned campus.

## ✅ Frontend Implementation (COMPLETE)

### Components Created

#### 1. CampusContext (`src/contexts/CampusContext.tsx`)
Global state management for campus selection.

**Features:**
- Stores selected campus in React context
- Persists selection to localStorage
- Auto-loads saved selection on mount
- Provides hooks for campus selection

**Exported Interface:**
```typescript
interface Campus {
  _id: string;
  campus_name: string;
  school_id?: {
    _id: string;
    school_name: string;
  };
}

interface CampusContextType {
  selectedCampus: Campus | null;
  setSelectedCampus: (campus: Campus | null) => void;
  availableCampuses: Campus[];
  setAvailableCampuses: (campuses: Campus[]) => void;
  isLoadingCampuses: boolean;
  setIsLoadingCampuses: (loading: boolean) => void;
  clearCampusSelection: () => void;
}
```

**Usage:**
```typescript
const { selectedCampus, setSelectedCampus, availableCampuses } = useCampus();
```

#### 2. CampusSelector Component (`src/components/CampusSelector.tsx`)
UI component in the top navigation bar.

**Features:**
- Dropdown selector with campus list
- Shows "All Universities" when no campus selected
- Auto-fetches campuses on mount
- Only visible to super_admin users
- Shows "Filtered" badge when campus selected
- Theme-aware styling
- Responsive design

**Visual Design:**
- Campus icon (cilBuilding) or globe icon (cilGlobeAlt)
- Two-line display: label + campus name
- Dropdown with search-friendly list
- Checkmark for selected campus
- School name as subtitle in dropdown

#### 3. useCampusFilter Hook (`src/hooks/useCampusFilter.ts`)
Automatic API request filtering.

**Features:**
- Adds selected `campus_id` to all API requests
- Works with GET params and POST/PUT/PATCH data
- Uses Axios interceptors
- Auto-cleans up on unmount

**How it works:**
```typescript
// Automatically adds to GET requests
GET /reports?campus_id=123

// Automatically adds to POST/PUT requests
POST /users { ...data, campus_id: "123" }
```

### Integration Points

#### main.tsx
Wrapped app with CampusProvider:
```typescript
<CampusProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</CampusProvider>
```

#### Topbar.tsx
Added CampusSelector component:
```typescript
<CampusSelector />
```

#### ExampleAdminLayout.tsx
Initialized campus filter:
```typescript
useCampusFilter(); // Activates API interceptor
```

### User Experience

#### For Super Admin:
1. See campus selector in top bar
2. Click to open dropdown
3. Select "All Universities" or specific campus
4. Selection persists across page reloads
5. Badge shows "Filtered" when campus selected
6. All data automatically filtered by selected campus

#### For Campus Admin / Staff:
- Campus selector is hidden
- Automatically locked to their assigned campus
- No ability to view other campuses

### LocalStorage Schema
```typescript
{
  "selectedCampus": {
    "_id": "campus_id",
    "campus_name": "Campus Name",
    "school_id": {
      "_id": "school_id",
      "school_name": "School Name"
    }
  }
}
```

## 🔧 Backend Requirements (TO IMPLEMENT)

### 1. Campus Listing Endpoint

**Existing Endpoint:** `GET /campuses`

**What's needed:**
- ✅ Already exists
- ✅ Returns list of all campuses for super_admin
- ⚠️ Need to verify response format matches frontend interface

**Expected Response:**
```json
{
  "campuses": [
    {
      "_id": "campus_id",
      "campus_name": "University of Example",
      "school_id": {
        "_id": "school_id",
        "school_name": "Example School"
      }
    }
  ]
}
```

### 2. Campus Filtering in Controllers

**What's needed:**
All admin controllers should accept and filter by `campus_id` parameter.

#### Controllers to Update:

**Reports Controller** (`src/controllers/report.controller.ts`)
```typescript
export const getReports = async (req: Request, res: Response) => {
  const { campus_id } = req.query;

  let query = {};
  if (campus_id) {
    // Filter reports by campus
    query = { 'reported_item.campus_id': campus_id };
  }

  const reports = await Report.find(query);
  // ...
}
```

**Users Controller** (`src/controllers/admin.controller.ts`)
```typescript
export const getAdminUsers = async (req: Request, res: Response) => {
  const { campus_id } = req.query;

  let query = {};
  if (campus_id) {
    query = { campus_id };
  }

  const users = await User.find(query);
  // ...
}
```

**Locked Users Controller** (`src/controllers/admin-user-unlock.controller.ts`)
```typescript
export const getLockedUsers = async (req: Request, res: Response) => {
  const { campus_id } = req.query;

  let query = { is_banned: true };
  if (campus_id) {
    query = { ...query, campus_id };
  }

  const users = await User.find(query);
  // ...
}
```

**Banned Users Controller**
```typescript
export const getBannedUsers = async (req: Request, res: Response) => {
  const { campus_id } = req.query;

  let query = { is_banned: true };
  if (campus_id) {
    query = { ...query, campus_id };
  }

  const users = await User.find(query);
  // ...
}
```

**Students Controller**
```typescript
export const getStudents = async (req: Request, res: Response) => {
  const { campus_id } = req.query;

  let query = { role: 'student' };
  if (campus_id) {
    query = { ...query, campus_id };
  }

  const students = await User.find(query);
  // ...
}
```

**Events Controller**
```typescript
export const getEvents = async (req: Request, res: Response) => {
  const { campus_id } = req.query;

  let query = {};
  if (campus_id) {
    query = { campus_id };
  }

  const events = await Event.find(query);
  // ...
}
```

**Analytics Endpoints**
All analytics endpoints should support campus filtering:
- `/analytics/engagement` - filter by campus
- `/analytics/social-health` - filter by campus
- `/walks/count` - filter by campus
- `/events/eventEngagement-count` - filter by campus
- `/ideas/count` - filter by campus

### 3. Permission Checks

**What's needed:**
Ensure non-super admins cannot:
- Access other campuses' data
- Select different campus in API calls

**Middleware Enhancement:**
```typescript
// In permission.middleware.ts
export const validateCampusAccess = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const requestedCampusId = req.query.campus_id || req.body.campus_id;

  // Super admin can access any campus
  if (user.role === 'super_admin') {
    return next();
  }

  // Non-super admins must match their campus
  if (requestedCampusId && requestedCampusId !== user.campus_id) {
    return res.status(403).json({ error: 'Cannot access other campus data' });
  }

  // Force campus_id for non-super admins
  if (!requestedCampusId && user.campus_id) {
    req.query.campus_id = user.campus_id;
    req.body.campus_id = user.campus_id;
  }

  next();
};
```

**Apply to routes:**
```typescript
router.get('/admin/reports',
  authJwt,
  hasRole(['super_admin', 'campus_admin']),
  validateCampusAccess, // Add this middleware
  getReports
);
```

### 4. Database Indexes

**What's needed:**
Ensure campus_id is indexed for performance.

```typescript
// In relevant models
schema.index({ campus_id: 1 });
schema.index({ campus_id: 1, created_at: -1 }); // Composite indexes
```

**Models to Index:**
- User model - `campus_id`
- Report model - `campus_id`
- Event model - `campus_id`
- Walk model - `campus_id`
- Idea model - `campus_id`

### 5. Testing Requirements

#### Backend Tests Needed:

**Unit Tests:**
```typescript
describe('Campus Filtering', () => {
  it('should filter reports by campus_id', async () => {
    // Test implementation
  });

  it('should prevent campus_admin from accessing other campus', async () => {
    // Test implementation
  });

  it('should allow super_admin to access any campus', async () => {
    // Test implementation
  });
});
```

**Integration Tests:**
- Test each admin endpoint with campus_id parameter
- Test permission denial for unauthorized campus access
- Test "All Universities" (no campus_id) for super_admin

## Implementation Checklist

### ✅ Frontend (COMPLETE)
- [x] Create CampusContext for state management
- [x] Create CampusSelector UI component
- [x] Add to Topbar navigation
- [x] Implement useCampusFilter hook
- [x] Add API request interceptor
- [x] Persist selection to localStorage
- [x] Handle super_admin vs campus_admin roles
- [x] Add visual indicators (badge, icons)
- [x] Build and verify no TypeScript errors

### 🔄 Backend (PENDING)
- [ ] Verify GET /campuses endpoint response format
- [ ] Add campus_id filtering to:
  - [ ] Reports controller
  - [ ] Users controller
  - [ ] Locked users controller
  - [ ] Banned users controller
  - [ ] Students controller
  - [ ] Events controller
  - [ ] Ambassadors controller
  - [ ] Analytics endpoints
  - [ ] Walk/engagement endpoints
  - [ ] Ideas endpoints
- [ ] Create validateCampusAccess middleware
- [ ] Apply middleware to all admin routes
- [ ] Add database indexes for campus_id
- [ ] Write unit tests for campus filtering
- [ ] Write integration tests
- [ ] Test super_admin "All Universities" mode
- [ ] Test campus_admin locked to their campus
- [ ] Performance testing with campus filtering

## API Examples

### Frontend Request (Automatic)
```typescript
// User selects campus in UI
setSelectedCampus({
  _id: "campus_123",
  campus_name: "University of Example"
});

// All subsequent API calls automatically include campus_id
// GET /admin/reports?campus_id=campus_123
// POST /admin/users { ...data, campus_id: "campus_123" }
```

### Backend Response
```json
{
  "reports": [
    {
      "_id": "report_id",
      "campus_id": "campus_123",
      // ... other fields
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 5
  }
}
```

## Security Considerations

1. **Permission Validation**: Never trust campus_id from frontend
2. **Role Checks**: Enforce super_admin-only access to all campuses
3. **Data Isolation**: Campus admins must only see their campus
4. **Audit Logging**: Log when super_admin switches campuses
5. **Rate Limiting**: Prevent campus enumeration attacks

## Performance Impact

**Frontend:**
- Minimal - single context and one interceptor
- LocalStorage read/write is negligible
- No additional API calls for normal operations

**Backend:**
- Query performance depends on indexes
- campus_id index is CRITICAL
- Composite indexes recommended for common queries
- Expected performance: < 50ms additional latency

## Deployment Steps

### Frontend (Ready to Deploy)
```bash
cd walky-admin
npm run build
# Deploy dist/ folder
```

### Backend (Requires Implementation)
1. Implement campus filtering in controllers
2. Add validateCampusAccess middleware
3. Add database indexes
4. Run tests
5. Deploy to staging
6. Test with real data
7. Deploy to production

## Rollback Plan

If issues occur after backend deployment:

1. **Quick Fix**: Remove validateCampusAccess middleware (allows all access)
2. **Feature Flag**: Add env variable `ENABLE_CAMPUS_FILTERING=false`
3. **Frontend Rollback**: Remove CampusSelector from Topbar (doesn't break anything)

## Support & Maintenance

**Common Issues:**

**"Campus selector not showing"**
- Check user role is super_admin
- Check campuses are fetched successfully
- Check browser console for errors

**"Data not filtering"**
- Check backend logs for campus_id in requests
- Verify backend controllers handle campus_id
- Check validateCampusAccess middleware is applied

**"Permission denied"**
- Verify user role in JWT token
- Check campus_id matches user's assigned campus
- Verify super_admin can access any campus

## Future Enhancements

1. **Multi-Campus Selection**: Allow selecting multiple campuses
2. **Campus Groups**: Group campuses by region/type
3. **Favorite Campuses**: Quick access to frequently used campuses
4. **Campus Comparison**: Side-by-side view of campus stats
5. **Campus-Specific Permissions**: Fine-grained permissions per campus
6. **Campus Analytics**: Track which campuses are viewed most

## Related Documentation

- [RBAC Implementation](./RBAC_IMPLEMENTATION.md) - Role-based access control
- Backend API Documentation - `/docs/api` (Swagger)
- User Management Guide - `/docs/users`
