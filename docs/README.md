# 🎯 Mixpanel Analytics Integration - Complete Setup

## ✅ Installation Complete!

Mixpanel has been successfully integrated into the Walky Admin application with the following configuration:

```javascript
Token: c1fb7e2bf5ee8afcde3812c7cdc7482d
Autocapture: Enabled
Session Recording: 100%
Debug Mode: Enabled in Development
```

## 📁 What's Been Added

### Core Files

- **`src/hooks/useMixpanel.ts`** - Main Mixpanel hook with all tracking methods
- **`src/types/mixpanel-events.ts`** - TypeScript types for consistent event tracking
- **`src/main.tsx`** - Updated with Mixpanel initialization

### Documentation

- **`docs/MIXPANEL_INTEGRATION.md`** - Complete integration guide
- **`docs/MIXPANEL_QUICK_START.md`** - Quick reference for developers
- **`docs/MIXPANEL_CHECKLIST.md`** - Implementation checklist

### Example Files (for reference)

- **`src/pages-v2/ExampleMixpanelUsage.tsx`** - Basic usage examples
- **`src/pages-v2/Dashboard/DashboardWithTracking.example.tsx`** - Dashboard tracking
- **`src/pages-v2/Admin/UserTableWithTracking.example.tsx`** - Table interactions
- **`src/hooks/useAuthWithMixpanel.example.ts`** - Authentication tracking

## 🚀 Quick Start

### 1. Basic Usage in Any Component

```typescript
import { useMixpanel } from "@/hooks/useMixpanel";
import { MixpanelEvents } from "@/types/mixpanel-events";

function MyComponent() {
  const { trackEvent, trackPageView } = useMixpanel();

  useEffect(() => {
    trackPageView("My Component");
  }, [trackPageView]);

  const handleClick = () => {
    trackEvent(MixpanelEvents.BUTTON_CLICKED, {
      button_name: "Submit",
      page: "My Component",
    });
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

### 2. Available Methods

| Method                      | Use Case               |
| --------------------------- | ---------------------- |
| `trackEvent()`              | Track custom events    |
| `trackPageView()`           | Track page views       |
| `identifyUser()`            | Identify users (login) |
| `resetUser()`               | Reset user (logout)    |
| `setUserProperties()`       | Set user profile data  |
| `incrementUserProperty()`   | Increment counters     |
| `registerSuperProperties()` | Add to all events      |
| `startTimingEvent()`        | Time events            |

## 🎯 What Gets Tracked Automatically

Mixpanel **autocapture** is enabled and automatically tracks:

- ✅ Page views (`[Auto] Page View`)
- ✅ Element clicks (`[Auto] Element Click`)
- ✅ Form submissions (`[Auto] Form Submitted`)
- ✅ Page scrolls (`[Auto] Page Scroll`)
- ✅ Rage clicks (`[Auto] Rage Click`) - frustrated users
- ✅ Dead clicks (`[Auto] Dead Click`) - non-responsive elements

## 🔒 Privacy & Security

- Passwords and sensitive inputs are **automatically excluded**
- Text content is **not captured**
- Use `.mp-sensitive` class for sensitive elements
- Use `.mp-no-track` class to exclude elements

```tsx
<input className="mp-sensitive" type="password" />
<button className="mp-no-track">Secret Button</button>
```

## 📚 Documentation

Choose your path:

1. **New to Mixpanel?** Start with [`MIXPANEL_QUICK_START.md`](./MIXPANEL_QUICK_START.md)
2. **Need details?** Read [`MIXPANEL_INTEGRATION.md`](./MIXPANEL_INTEGRATION.md)
3. **Adding to component?** Use [`MIXPANEL_CHECKLIST.md`](./MIXPANEL_CHECKLIST.md)

## 💡 Common Use Cases

### Track Page View

```typescript
useEffect(() => {
  trackPageView("Dashboard V2", {
    section: "Admin",
    version: "v2",
  });
}, [trackPageView]);
```

### Track Button Click

```typescript
const handleClick = () => {
  trackEvent("Button Clicked", {
    button_name: "Save Changes",
    action_type: "submit",
  });
};
```

### Track User Login

```typescript
const handleLogin = (userData: User) => {
  identifyUser({
    id: userData._id,
    email: userData.email,
    firstName: userData.first_name,
    lastName: userData.last_name,
    role: userData.role,
  });

  trackEvent("User Logged In", {
    user_role: userData.role,
  });
};
```

### Track User Logout

```typescript
const handleLogout = () => {
  trackEvent("User Logged Out");
  resetUser();
};
```

### Track Modal

```typescript
const handleModalOpen = () => {
  trackEvent("Modal Opened", {
    modal_name: "User Settings",
    trigger: "button_click",
  });
};
```

### Track Form with Timing

```typescript
useEffect(() => {
  startTimingEvent("Form Completed");
}, [startTimingEvent]);

const handleSubmit = () => {
  trackEvent("Form Completed", {
    form_name: "User Profile",
    fields_count: 5,
  });
};
```

### Track Table Sort

```typescript
const handleSort = (column: string) => {
  trackEvent("Table Sorted", {
    table_name: "users",
    sort_column: column,
    sort_direction: "asc",
  });
};
```

### Track API Error

```typescript
try {
  await fetchData();
} catch (error) {
  trackEvent("API Call Failed", {
    endpoint: "/api/users",
    error_message: error.message,
  });
}
```

## 🎨 Integration with V2 Components

All examples are designed for **V2 components** in:

- `src/pages-v2/`
- `src/components-v2/`
- `src/layout-v2/`

Simply import the hook and start tracking!

## 🐛 Debugging

In development mode, all events are logged to the console:

```bash
# Start dev server
yarn dev

# Open browser console to see Mixpanel events
# Look for: "Mixpanel initialized"
# Then see all tracked events in real-time
```

## 🔍 View Your Data

Login to Mixpanel to see your events:

- Dashboard: https://mixpanel.com/
- Project: Walky Admin
- Token: `c1fb7e2bf5ee8afcde3812c7cdc7482d`

## ✅ Next Steps

1. **Start tracking** - Add tracking to your components
2. **Test locally** - Check console for events
3. **Verify in Mixpanel** - View events in dashboard
4. **Iterate** - Add more tracking as needed

## 📦 Files Overview

```
src/
  hooks/
    useMixpanel.ts                    ✨ Main hook
    useAuthWithMixpanel.example.ts    📘 Auth example
  types/
    mixpanel-events.ts                📝 Event types
  pages-v2/
    ExampleMixpanelUsage.tsx          📘 Basic example
    Dashboard/
      DashboardWithTracking.example.tsx  📘 Dashboard example
    Admin/
      UserTableWithTracking.example.tsx  📘 Table example

docs/
  README.md                           📄 This file
  MIXPANEL_INTEGRATION.md             📚 Full guide
  MIXPANEL_QUICK_START.md             🚀 Quick reference
  MIXPANEL_CHECKLIST.md               ✅ Checklist
```

## 🤝 Support

- Check example files in `src/pages-v2/`
- Read documentation in `docs/`
- Visit [Mixpanel Docs](https://docs.mixpanel.com/)
- Ask the team!

---

**Happy Tracking! 🎉**

Everything is ready to use. Just import the hook and start tracking events in your V2 components!
