# 🎯 Mixpanel Integration - Visual Guide

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Your Application                        │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              V2 Components                          │    │
│  │  (pages-v2/, components-v2/, layout-v2/)          │    │
│  │                                                     │    │
│  │  ┌──────────────────────────────────────────┐    │    │
│  │  │   import { useMixpanel }                 │    │    │
│  │  │                                          │    │    │
│  │  │   const { trackEvent, trackPageView }   │    │    │
│  │  │                                          │    │    │
│  │  │   trackEvent('Button Clicked', {...})   │    │    │
│  │  └──────────────────────────────────────────┘    │    │
│  └────────────────────────────────────────────────────┘    │
│                          ↓                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │         useMixpanel Hook                            │    │
│  │         (src/hooks/useMixpanel.ts)                 │    │
│  │                                                     │    │
│  │  • trackEvent()                                    │    │
│  │  • trackPageView()                                 │    │
│  │  • identifyUser()                                  │    │
│  │  • resetUser()                                     │    │
│  │  • setUserProperties()                             │    │
│  │  • incrementUserProperty()                         │    │
│  └────────────────────────────────────────────────────┘    │
│                          ↓                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │      Mixpanel Browser SDK                           │    │
│  │      (mixpanel-browser)                            │    │
│  │                                                     │    │
│  │  • Autocapture: ON                                 │    │
│  │  • Session Recording: 100%                         │    │
│  │  • Token: c1fb7e2bf5ee8afcde3812c7cdc7482d       │    │
│  └────────────────────────────────────────────────────┘    │
│                          ↓                                   │
└──────────────────────────┼───────────────────────────────────┘
                          ↓
              ┌───────────────────────┐
              │   Mixpanel Cloud      │
              │   (Analytics Data)    │
              └───────────────────────┘
```

## 🔄 Event Flow

```
User Action → Component Handler → useMixpanel Hook → Mixpanel SDK → Cloud
                                                            ↓
                                                    Autocapture Events
```

## 📁 File Structure

```
walky-admin/
│
├── src/
│   ├── hooks/
│   │   ├── useMixpanel.ts                        ⭐ Main hook
│   │   ├── useAuthWithMixpanel.example.ts        📘 Auth example
│   │   └── index.ts                              📦 Exports
│   │
│   ├── types/
│   │   └── mixpanel-events.ts                    📝 Event types
│   │
│   ├── pages-v2/
│   │   ├── ExampleMixpanelUsage.tsx              📘 Examples
│   │   ├── Dashboard/
│   │   │   └── DashboardWithTracking.example.tsx 📘 Dashboard
│   │   └── Admin/
│   │       └── UserTableWithTracking.example.tsx 📘 Table
│   │
│   └── main.tsx                                   🚀 Initialization
│
├── docs/
│   ├── README.md                                  📄 Overview
│   ├── MIXPANEL_INTEGRATION.md                   📚 Full guide
│   ├── MIXPANEL_QUICK_START.md                   🚀 Quick ref
│   └── MIXPANEL_CHECKLIST.md                     ✅ Checklist
│
└── package.json                                   📦 Dependencies
```

## 🎬 Usage Flow

### Step 1: Component Mounts

```typescript
import { useMixpanel } from '@/hooks/useMixpanel';

function MyComponent() {
  const { trackPageView } = useMixpanel();

  useEffect(() => {
    trackPageView('My Component');  // ✅ Tracked
  }, [trackPageView]);
```

### Step 2: User Interacts

```typescript
  const handleClick = () => {
    trackEvent('Button Clicked', {  // ✅ Tracked
      button_name: 'Submit',
    });
  };

  return <button onClick={handleClick}>Submit</button>;
}
```

### Step 3: Data Flows

```
Component → Hook → SDK → Cloud → Dashboard
```

## 🎯 What Gets Tracked

### Automatic (Autocapture)

```
✅ Page Views          → [Auto] Page View
✅ Element Clicks      → [Auto] Element Click
✅ Form Submissions    → [Auto] Form Submitted
✅ Scrolling           → [Auto] Page Scroll
✅ Rage Clicks         → [Auto] Rage Click
✅ Dead Clicks         → [Auto] Dead Click
```

### Manual (Custom Events)

```
📝 Your custom events → "Button Clicked"
📝 Your custom events → "Form Completed"
📝 Your custom events → "Modal Opened"
📝 Your custom events → "Table Sorted"
...etc
```

## 🔐 Privacy Protection

```
✅ Sensitive inputs     → Automatically excluded
✅ Passwords            → Never tracked
✅ Credit cards         → Never tracked
✅ .mp-sensitive class  → Excluded from tracking
✅ .mp-no-track class   → Excluded from tracking
```

## 📊 Event Properties

```typescript
trackEvent("Button Clicked", {
  // Context
  page: "Dashboard", // Where?
  section: "Admin", // Which section?

  // Details
  button_name: "Save Changes", // What?
  button_type: "primary", // Type?

  // User context
  user_role: "admin", // Who?

  // Timestamp
  timestamp: "2024-01-01...", // When?
});
```

## 🎨 Component Integration Pattern

```typescript
function ComponentV2() {
  // 1. Get hook methods
  const { trackEvent, trackPageView, identifyUser, resetUser } = useMixpanel();

  // 2. Track page view
  useEffect(() => {
    trackPageView("Component Name");
  }, [trackPageView]);

  // 3. Track interactions
  const handleAction = () => {
    trackEvent("Action Name", {
      /* properties */
    });
  };

  // 4. Track user auth
  const handleLogin = (user) => {
    identifyUser(user);
  };

  const handleLogout = () => {
    resetUser();
  };

  return <div>...</div>;
}
```

## 🛠️ Available Methods

| Method                      | Purpose        | Example                |
| --------------------------- | -------------- | ---------------------- |
| `trackEvent()`              | Custom events  | Button clicks, actions |
| `trackPageView()`           | Page views     | Component mounts       |
| `identifyUser()`            | User identity  | After login            |
| `resetUser()`               | Clear identity | After logout           |
| `setUserProperties()`       | User profile   | User metadata          |
| `incrementUserProperty()`   | Counters       | Usage counts           |
| `registerSuperProperties()` | Global props   | App version            |
| `startTimingEvent()`        | Event timing   | Form completion        |

## 📈 Data Journey

```
┌──────────────┐
│ User clicks  │
│   button     │
└──────┬───────┘
       ↓
┌──────────────────┐
│ handleClick()    │
│ trackEvent(...)  │
└──────┬───────────┘
       ↓
┌──────────────────┐
│ useMixpanel hook │
│ validates data   │
└──────┬───────────┘
       ↓
┌──────────────────┐
│ Mixpanel SDK     │
│ sends to cloud   │
└──────┬───────────┘
       ↓
┌──────────────────┐
│ Mixpanel Cloud   │
│ stores data      │
└──────┬───────────┘
       ↓
┌──────────────────┐
│ Dashboard        │
│ shows insights   │
└──────────────────┘
```

## 🚀 Getting Started Steps

```
1. ✅ Mixpanel installed        (Done)
2. ✅ Hook created              (Done)
3. ✅ Initialized in main.tsx   (Done)
4. ✅ Examples created          (Done)
5. ✅ Documentation written     (Done)
6. 👉 Start using in components (Your turn!)
```

## 💡 Quick Reference Card

```typescript
// Import
import { useMixpanel } from "@/hooks/useMixpanel";
import { MixpanelEvents } from "@/types/mixpanel-events";

// Setup
const { trackEvent, trackPageView } = useMixpanel();

// Page view
trackPageView("Page Name");

// Event
trackEvent(MixpanelEvents.BUTTON_CLICKED, {
  button_name: "Submit",
  page: "Dashboard",
});

// User login
identifyUser({
  id: user._id,
  email: user.email,
  firstName: user.first_name,
  lastName: user.last_name,
  role: user.role,
});

// User logout
resetUser();
```

## 🎓 Learn More

- 📄 Overview: `docs/README.md`
- 🚀 Quick Start: `docs/MIXPANEL_QUICK_START.md`
- 📚 Full Guide: `docs/MIXPANEL_INTEGRATION.md`
- ✅ Checklist: `docs/MIXPANEL_CHECKLIST.md`
- 📘 Examples: `src/pages-v2/*.example.tsx`

---

**Ready to track? Import the hook and start! 🎉**
