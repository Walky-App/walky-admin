# Mixpanel Integration Guide

## Overview

This project now includes Mixpanel analytics with autocapture enabled. The integration provides both automatic event tracking and custom event tracking capabilities.

## Features

- ✅ **Autocapture**: Automatically tracks page views, clicks, form submissions, and other interactions
- ✅ **Session Recording**: Records 100% of user sessions for replay
- ✅ **Custom Events**: Track custom business events with properties
- ✅ **User Identification**: Link events to specific users
- ✅ **User Properties**: Store and update user profile data
- ✅ **Super Properties**: Attach properties to all events automatically
- ✅ **Event Timing**: Measure time between events

## Configuration

Mixpanel is initialized in `src/main.tsx` with the following settings:

```typescript
mixpanel.init("c1fb7e2bf5ee8afcde3812c7cdc7482d", {
  autocapture: true, // Enable automatic event capture
  record_sessions_percent: 100, // Record all sessions
  debug: import.meta.env.DEV, // Debug mode in development
  track_pageview: true, // Automatically track page views
  persistence: "localStorage", // Store data in localStorage
});
```

## Usage

### Basic Setup

Import the hook in your component:

```typescript
import { useMixpanel } from "@/hooks/useMixpanel";

function MyComponent() {
  const { trackEvent, identifyUser, trackPageView } = useMixpanel();

  // Your component code
}
```

### Track Page Views

Automatically track when a user views a page:

```typescript
useEffect(() => {
  trackPageView("Dashboard", {
    section: "Admin",
    userRole: "admin",
  });
}, [trackPageView]);
```

### Track Custom Events

Track specific user actions:

```typescript
const handleButtonClick = () => {
  trackEvent("Button Clicked", {
    button_name: "Save Changes",
    page: "Settings",
    category: "User Actions",
  });
};
```

### Identify Users

Call this after successful login to associate events with a user:

```typescript
const handleLogin = (userData) => {
  identifyUser({
    id: userData._id,
    email: userData.email,
    firstName: userData.first_name,
    lastName: userData.last_name,
    role: userData.role,
    campusId: userData.campus_id,
    schoolId: userData.school_id,
  });
};
```

### Reset User on Logout

Clear user identification when they log out:

```typescript
const handleLogout = () => {
  resetUser();
  // Your logout logic
};
```

### Track Form Completion with Timing

Measure how long it takes users to complete a form:

```typescript
const handleFormStart = () => {
  startTimingEvent("Form Completed");
};

const handleFormSubmit = () => {
  trackEvent("Form Completed", {
    form_type: "user_profile",
    fields_count: 5,
  });
};
```

### Set User Properties

Update user profile data:

```typescript
setUserProperties({
  subscription_plan: "premium",
  last_active: new Date().toISOString(),
  campus_count: 3,
});
```

### Increment Numeric Properties

Track cumulative actions:

```typescript
incrementUserProperty("events_created", 1);
incrementUserProperty("total_posts", 1);
```

### Register Super Properties

Add properties that will be sent with every event:

```typescript
useEffect(() => {
  registerSuperProperties({
    app_version: "2.0",
    environment: import.meta.env.MODE,
    campus_id: currentCampus?.id,
  });
}, [currentCampus]);
```

## Common Tracking Scenarios

### 1. Track Modal Opens/Closes

```typescript
const handleModalOpen = (modalName: string) => {
  trackEvent("Modal Opened", {
    modal_name: modalName,
    trigger: "button_click",
  });
};
```

### 2. Track Filter Usage

```typescript
const handleFilterApply = (filters: Record<string, string>) => {
  trackEvent("Filters Applied", {
    filter_count: Object.keys(filters).length,
    filters: JSON.stringify(filters),
  });
};
```

### 3. Track Search

```typescript
const handleSearch = (query: string, results: number) => {
  trackEvent("Search Performed", {
    search_query: query,
    results_count: results,
    search_category: "users",
  });
};
```

### 4. Track API Errors

```typescript
const handleApiError = (error: Error, endpoint: string) => {
  trackEvent("API Error", {
    error_message: error.message,
    endpoint: endpoint,
    status_code: error.status,
  });
};
```

### 5. Track Feature Usage

```typescript
const handleFeatureUse = (featureName: string) => {
  trackEvent("Feature Used", {
    feature_name: featureName,
    page: currentPage,
  });

  incrementUserProperty(`${featureName}_usage_count`, 1);
};
```

### 6. Track Data Export

```typescript
const handleExport = (exportType: string, recordCount: number) => {
  trackEvent("Data Exported", {
    export_type: exportType,
    record_count: recordCount,
    format: "csv",
  });
};
```

## Best Practices

### 1. Consistent Naming Convention

Use a consistent naming pattern for events:

- Use Title Case for event names: "Button Clicked", "Form Submitted"
- Use snake_case for property names: `button_name`, `user_id`
- Group related events with prefixes: "Modal Opened", "Modal Closed"

### 2. Add Context Properties

Always include contextual information:

```typescript
trackEvent("Action Performed", {
  page: "Dashboard",
  section: "User Management",
  user_role: currentUser.role,
  campus_id: currentCampus.id,
});
```

### 3. Track Both Success and Failure

```typescript
try {
  await saveChanges();
  trackEvent("Changes Saved", { entity_type: "user" });
} catch (error) {
  trackEvent("Save Failed", {
    entity_type: "user",
    error_message: error.message,
  });
}
```

### 4. Avoid PII in Event Properties

Don't send sensitive personal information:

```typescript
// ❌ Bad
trackEvent("User Viewed Profile", {
  email: "user@example.com",
  password: "secret123",
});

// ✅ Good
trackEvent("User Viewed Profile", {
  user_id: userId,
  profile_type: "public",
});
```

### 5. Use Environment-Specific Tracking

```typescript
if (import.meta.env.PROD) {
  trackEvent("Production Event", properties);
}
```

## Autocapture Events

Mixpanel automatically tracks these events with `[Auto]` prefix:

- **[Auto] Page View** - When a page loads
- **[Auto] Element Click** - When users click interactive elements
- **[Auto] Form Submitted** - When forms are submitted
- **[Auto] Page Scroll** - When users scroll pages
- **[Auto] Rage Click** - When users click repeatedly (indicates frustration)
- **[Auto] Dead Click** - When users click elements that don't respond

### Opting Out Elements

To exclude specific elements from autocapture:

```tsx
// Exclude from all tracking
<button className="mp-no-track">Don't Track Me</button>

// Mark as sensitive (won't be included in any events)
<input className="mp-sensitive" type="password" />
```

## Hook API Reference

### `useMixpanel()`

Returns an object with these methods:

- **`trackEvent(eventName, properties?)`** - Track a custom event
- **`identifyUser(user)`** - Identify a user
- **`resetUser()`** - Reset user identification (logout)
- **`trackPageView(pageName, properties?)`** - Track a page view
- **`setUserProperties(properties)`** - Set user profile properties
- **`setUserPropertiesOnce(properties)`** - Set properties only if they don't exist
- **`incrementUserProperty(property, value?)`** - Increment a numeric property
- **`trackRevenue(amount, properties?)`** - Track revenue/transactions
- **`registerSuperProperties(properties)`** - Add properties to all events
- **`unregisterSuperProperty(property)`** - Remove a super property
- **`startTimingEvent(eventName)`** - Start timing an event

## Privacy & Security

- By default, Mixpanel excludes sensitive form fields (passwords, credit cards)
- Text content is not captured by autocapture
- Use `.mp-sensitive` class to mark any element as sensitive
- User identification is handled securely with hashed IDs
- All data is stored in localStorage with encryption

## Debugging

In development mode, Mixpanel logs all events to the console. Check your browser console to see tracked events.

To manually debug:

```typescript
// Check if Mixpanel is initialized
console.log(window.mixpanel);

// View current super properties
console.log(window.mixpanel.persistence.properties());

// View current user ID
console.log(window.mixpanel.get_distinct_id());
```

## Example Integration

See `src/pages-v2/ExampleMixpanelUsage.tsx` for a complete working example with all features demonstrated.

## Resources

- [Mixpanel JavaScript SDK Documentation](https://docs.mixpanel.com/docs/tracking-methods/sdks/javascript)
- [Autocapture Documentation](https://docs.mixpanel.com/docs/tracking-methods/autocapture)
- [Best Practices Guide](https://docs.mixpanel.com/docs/tracking-best-practices)

## Support

For questions or issues with Mixpanel integration, contact the development team or refer to the Mixpanel documentation.
