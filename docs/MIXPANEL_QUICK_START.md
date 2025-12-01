# Mixpanel Quick Start Guide for V2 Components

## Installation ✅

Mixpanel is already installed and initialized in your application!

```bash
# Already installed
yarn add mixpanel-browser
```

## Basic Usage

### 1. Import the Hook

```typescript
import { useMixpanel } from "@/hooks/useMixpanel";
```

### 2. Use in Your Component

```typescript
function MyComponentV2() {
  const { trackEvent, trackPageView } = useMixpanel();

  useEffect(() => {
    trackPageView("My Component");
  }, [trackPageView]);

  const handleClick = () => {
    trackEvent("Button Clicked", {
      component: "MyComponentV2",
      action: "submit",
    });
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

## Common Patterns for V2 Components

### Track Page Views

```typescript
useEffect(() => {
  trackPageView("Dashboard V2", {
    section: "Admin",
    version: "v2",
  });
}, [trackPageView]);
```

### Track Button Clicks

```typescript
const handleButtonClick = () => {
  trackEvent("Action Performed", {
    action_type: "submit",
    button_name: "Save Changes",
    page: "Settings",
  });
};
```

### Track Modal Events

```typescript
const handleModalOpen = (modalName: string) => {
  trackEvent("Modal Opened", {
    modal_name: modalName,
    trigger: "button_click",
  });
};

const handleModalClose = () => {
  trackEvent("Modal Closed", {
    modal_name: modalName,
    interaction_completed: false,
  });
};
```

### Track Form Events

```typescript
// Start timing when form is opened
useEffect(() => {
  startTimingEvent("Form Completed");
}, [startTimingEvent]);

// Track completion
const handleFormSubmit = () => {
  trackEvent("Form Completed", {
    form_name: "User Profile",
    fields_count: 5,
  });
};
```

### Track Filter Changes

```typescript
const handleFilterChange = (filterType: string, value: string) => {
  trackEvent("Filter Applied", {
    filter_type: filterType,
    filter_value: value,
    page: "Users",
  });
};
```

### Track Search

```typescript
const handleSearch = (query: string, resultsCount: number) => {
  trackEvent("Search Performed", {
    search_query: query,
    results_count: resultsCount,
    page: currentPage,
  });
};
```

### Track Table Interactions

```typescript
// Sort
const handleSort = (column: string, direction: "asc" | "desc") => {
  trackEvent("Table Sorted", {
    sort_column: column,
    sort_direction: direction,
    table_name: "users",
  });
};

// Row selection
const handleRowSelect = (rowId: string) => {
  trackEvent("Table Row Selected", {
    table_name: "users",
    row_id: rowId,
  });
};

// Export
const handleExport = () => {
  trackEvent("Table Data Exported", {
    table_name: "users",
    total_rows: data.length,
    format: "csv",
  });
};
```

### Track API Errors

```typescript
try {
  await apiCall();
  trackEvent("API Call Success", { endpoint: "/api/users" });
} catch (error) {
  trackEvent("API Call Failed", {
    endpoint: "/api/users",
    error_message: error.message,
  });
}
```

### Track User Identification (Login)

```typescript
const handleLogin = (userData: User) => {
  identifyUser({
    id: userData._id,
    email: userData.email,
    firstName: userData.first_name,
    lastName: userData.last_name,
    role: userData.role,
    campusId: userData.campus_id,
    schoolId: userData.school_id,
  });

  trackEvent("User Logged In", {
    user_role: userData.role,
    login_method: "email",
  });
};
```

### Track Logout

```typescript
const handleLogout = () => {
  trackEvent("User Logged Out");
  resetUser();
};
```

## Property Naming Convention

- **Event Names**: Use Title Case - `"Button Clicked"`, `"Form Submitted"`
- **Property Keys**: Use snake_case - `button_name`, `user_id`, `page_name`
- **Values**: Use lowercase strings, numbers, or booleans

## What to Track

### ✅ DO Track:

- Page views
- Button clicks
- Form submissions
- Modal opens/closes
- Filter/search usage
- Data exports
- API errors
- Feature usage
- User actions (CRUD operations)

### ❌ DON'T Track:

- Passwords or sensitive data
- Full email addresses (use user IDs instead)
- Credit card information
- Personal identifying information

## Autocapture

Mixpanel automatically tracks these events:

- `[Auto] Page View`
- `[Auto] Element Click`
- `[Auto] Form Submitted`
- `[Auto] Rage Click` (frustrated users)
- `[Auto] Dead Click` (non-responsive elements)

### Exclude Elements from Tracking

```tsx
// Don't track this element
<button className="mp-no-track">Secret Button</button>

// Mark as sensitive
<input className="mp-sensitive" type="password" />
```

## Examples

Check out these complete working examples:

1. **Basic Usage**: `src/pages-v2/ExampleMixpanelUsage.tsx`
2. **Dashboard with Tracking**: `src/pages-v2/Dashboard/DashboardWithTracking.example.tsx`
3. **Table with Tracking**: `src/pages-v2/Admin/UserTableWithTracking.example.tsx`
4. **Auth Integration**: `src/hooks/useAuthWithMixpanel.example.ts`

## Full Documentation

See `/docs/MIXPANEL_INTEGRATION.md` for complete documentation.

## Hook API

### Available Methods:

| Method                             | Description                |
| ---------------------------------- | -------------------------- |
| `trackEvent(name, props)`          | Track a custom event       |
| `trackPageView(name, props)`       | Track page view            |
| `identifyUser(user)`               | Identify a user            |
| `resetUser()`                      | Reset user (logout)        |
| `setUserProperties(props)`         | Set user properties        |
| `incrementUserProperty(prop, val)` | Increment numeric property |
| `registerSuperProperties(props)`   | Add props to all events    |
| `startTimingEvent(name)`           | Start timing an event      |

## Need Help?

- Check the console in development mode to see tracked events
- Review example components in `src/pages-v2/`
- Read full docs at `/docs/MIXPANEL_INTEGRATION.md`
- Visit [Mixpanel Docs](https://docs.mixpanel.com/docs/tracking-methods/sdks/javascript)
