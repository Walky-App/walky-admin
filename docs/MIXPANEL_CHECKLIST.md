# Mixpanel Integration Checklist

Use this checklist when adding Mixpanel tracking to new V2 components.

## ✅ Component Setup

- [ ] Import `useMixpanel` hook
- [ ] Import event types from `@/types/mixpanel-events` (optional but recommended)
- [ ] Destructure needed methods from hook

```typescript
import { useMixpanel } from "@/hooks/useMixpanel";
import { MixpanelEvents } from "@/types/mixpanel-events";

const { trackEvent, trackPageView } = useMixpanel();
```

## ✅ Page Tracking

- [ ] Add `trackPageView` call in `useEffect` when component mounts

```typescript
useEffect(() => {
  trackPageView("Component Name", {
    section: "Admin",
    version: "v2",
  });
}, [trackPageView]);
```

## ✅ User Actions

Track these common interactions:

### Buttons & Links

- [ ] Track primary action buttons
- [ ] Track navigation links
- [ ] Track CTAs (Call to Action)

```typescript
const handleButtonClick = () => {
  trackEvent(MixpanelEvents.BUTTON_CLICKED, {
    button_name: "Save Changes",
    page: "Settings",
  });
};
```

### Forms

- [ ] Track form starts (optional timing)
- [ ] Track form submissions
- [ ] Track form errors
- [ ] Track form abandonment (optional)

```typescript
useEffect(() => {
  startTimingEvent(MixpanelEvents.FORM_COMPLETED);
}, []);

const handleSubmit = () => {
  trackEvent(MixpanelEvents.FORM_COMPLETED, {
    form_name: "User Profile",
    fields_count: 5,
  });
};
```

### Modals

- [ ] Track modal opens
- [ ] Track modal closes
- [ ] Track modal interactions

```typescript
const handleModalOpen = () => {
  trackEvent(MixpanelEvents.MODAL_OPENED, {
    modal_name: "Edit User",
    trigger: "button_click",
  });
};
```

### Tables/Lists

- [ ] Track sorting
- [ ] Track filtering
- [ ] Track searching
- [ ] Track row selection
- [ ] Track pagination
- [ ] Track bulk actions
- [ ] Track exports

```typescript
const handleSort = (column: string) => {
  trackEvent(MixpanelEvents.TABLE_SORTED, {
    table_name: "users",
    sort_column: column,
  });
};
```

### Filters & Search

- [ ] Track filter applications
- [ ] Track search queries
- [ ] Track filter clears

```typescript
const handleSearch = (query: string) => {
  trackEvent(MixpanelEvents.SEARCH_PERFORMED, {
    search_query: query,
    results_count: results.length,
  });
};
```

## ✅ API Interactions

- [ ] Track successful API calls (important endpoints only)
- [ ] Track API errors
- [ ] Track slow responses (optional)

```typescript
try {
  const data = await fetchData();
  trackEvent(MixpanelEvents.API_CALL_SUCCESS, {
    endpoint: "/api/users",
  });
} catch (error) {
  trackEvent(MixpanelEvents.API_CALL_FAILED, {
    endpoint: "/api/users",
    error_message: error.message,
  });
}
```

## ✅ Feature Usage

- [ ] Track feature toggles
- [ ] Track feature usage frequency
- [ ] Track feature access

```typescript
const handleFeatureUse = (feature: string) => {
  trackEvent(MixpanelEvents.FEATURE_USED, {
    feature_name: feature,
  });
  incrementUserProperty(`${feature}_usage_count`, 1);
};
```

## ✅ User Identification

For authentication flows:

- [ ] Call `identifyUser` on login
- [ ] Call `resetUser` on logout
- [ ] Set user properties after login

```typescript
const handleLogin = (userData: User) => {
  identifyUser({
    id: userData._id,
    email: userData.email,
    firstName: userData.first_name,
    lastName: userData.last_name,
    role: userData.role,
  });
};

const handleLogout = () => {
  resetUser();
};
```

## ✅ Property Consistency

- [ ] Use consistent naming: `snake_case` for properties
- [ ] Include page/section context in events
- [ ] Add timestamps for time-sensitive events
- [ ] Use standardized values (e.g., 'active', 'inactive' not 'Active', 'Inactive')

## ✅ Privacy & Security

- [ ] No passwords in events ❌
- [ ] No credit card info ❌
- [ ] No PII (use IDs instead) ❌
- [ ] Add `mp-no-track` class to sensitive elements
- [ ] Add `mp-sensitive` class to sensitive inputs

```tsx
<input className="mp-sensitive" type="password" />
<button className="mp-no-track">Secret Action</button>
```

## ✅ Testing

- [ ] Check console in dev mode for event logs
- [ ] Verify events appear in Mixpanel dashboard
- [ ] Test all interaction paths
- [ ] Verify property values are correct

## ✅ Documentation

- [ ] Add comments for complex tracking logic
- [ ] Document custom event names in team docs
- [ ] Share tracking plan with team

## 📝 Common Mistakes to Avoid

- ❌ Tracking too many events (focus on valuable insights)
- ❌ Inconsistent property naming
- ❌ Forgetting to add page context
- ❌ Including sensitive data
- ❌ Not testing events in development
- ❌ Hardcoding values instead of using variables
- ❌ Calling `trackEvent` in render (use event handlers)

## ✨ Best Practices

- ✅ Use the `MixpanelEvents` constants for event names
- ✅ Use TypeScript interfaces for event properties
- ✅ Add context properties (page, section, user_role)
- ✅ Track both success and failure states
- ✅ Use `startTimingEvent` for time-sensitive events
- ✅ Increment user properties for cumulative actions
- ✅ Test in development before deploying

## 📚 Resources

- Quick Start: `/docs/MIXPANEL_QUICK_START.md`
- Full Documentation: `/docs/MIXPANEL_INTEGRATION.md`
- Event Types: `/src/types/mixpanel-events.ts`
- Example Components:
  - `/src/pages-v2/ExampleMixpanelUsage.tsx`
  - `/src/pages-v2/Dashboard/DashboardWithTracking.example.tsx`
  - `/src/pages-v2/Admin/UserTableWithTracking.example.tsx`

---

**Remember**: Quality over quantity! Track meaningful events that will provide actionable insights.
