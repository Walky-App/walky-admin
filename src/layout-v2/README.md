# Layout V2 - Figma-Based Design System

This folder contains the new layout components generated from the Figma design for the Walky Admin Portal.

## 📁 Structure

```
layout-v2/
├── LayoutV2.tsx       # Main layout wrapper
├── LayoutV2.css       # Layout styles
├── SidebarV2.tsx      # New sidebar component
├── SidebarV2.css      # Sidebar styles
├── TopbarV2.tsx       # New topbar component
├── TopbarV2.css       # Topbar styles
└── index.ts           # Exports
```

## 🎨 Design Source

- **Figma File**: [Walky Admin Portal](https://www.figma.com/design/Kthn7Wm5T1Bhcb5GuzLfV0/Walky-Admin-Portal?node-id=1578-48982&m=dev)
- **Node IDs**:
  - Sidebar: `1578-48983`
  - Topbar: `1578-49185`

## 🚀 Usage

### 1. Add to Router

In your `App.tsx` or main router file:

```tsx
import { V2Routes } from "./routes/v2Routes";

function App() {
  return (
    <Routes>
      {/* Existing routes */}
      <Route path="/*" element={<OldLayout />} />

      {/* New V2 routes */}
      <Route path="/v2/*" element={<V2Routes />} />
    </Routes>
  );
}
```

### 2. Create New Pages

Pages should be created in the `src/pages-v2/` folder:

```tsx
import React from "react";

const MyNewPage: React.FC = () => {
  return <div>{/* Your page content */}</div>;
};

export default MyNewPage;
```

### 3. Add Routes

Update `src/routes/v2Routes.tsx`:

```tsx
<Route path="my-new-page" element={<MyNewPage />} />
```

## 🎯 Features

### Sidebar (SidebarV2)

- **Fixed width**: 224px
- **Collapsible menu sections**
- **Active state indicators**
- **Submenu support**
- **Responsive** (hides on mobile)
- **Smooth animations**

#### Menu Structure

```tsx
{
  title: 'SECTION NAME',
  items: [
    {
      label: 'Menu Item',
      path: '/v2/path',
      submenu: [ // Optional
        { label: 'Subitem', path: '/v2/path/subitem' }
      ]
    }
  ]
}
```

### Topbar (TopbarV2)

- **School selector** (dropdown)
- **Campus selector** (dropdown)
- **Notification bell** (with badge)
- **User dropdown** (profile, settings, logout)
- **Hamburger menu** (mobile)
- **Responsive design**

### Layout (LayoutV2)

- **Flexbox-based** layout
- **Sidebar toggle** functionality
- **Mobile overlay** for sidebar
- **Sticky topbar**
- **Content area** with proper spacing
- **Print-friendly**

## 🎨 Styling

### Color Palette

```css
/* Primary Colors */
--primary-purple: #5e5ce6;
--primary-purple-light: #526ac9;

/* Backgrounds */
--bg-page: #f4f5f7;
--bg-white: #ffffff;
--bg-select: #edf2ff;

/* Text Colors */
--text-black: #1d1b20;
--text-dark-grey: #5b6168;

/* Borders */
--border-light: #eef0f1;
--border-dark: #d2d2d3;
```

### Typography

- **Font Family**: 'Lato', sans-serif
- **Weights**: 400 (Regular), 600 (Semibold), 700 (Bold), 900 (Black)
- **Sizes**: 12px, 14px, 16px, 18px, 24px, 28px, 32px

## 📱 Responsive Breakpoints

- **Desktop**: > 992px (sidebar visible)
- **Tablet**: 768px - 992px (sidebar collapsible)
- **Mobile**: < 768px (sidebar hidden, hamburger menu)

## 🔧 Customization

### Adding New Menu Items

Edit `SidebarV2.tsx` and add to the `menuSections` array:

```tsx
{
  title: 'YOUR SECTION',
  items: [
    {
      label: 'New Item',
      path: '/v2/new-item'
    }
  ]
}
```

### Changing Sidebar Width

Update both `SidebarV2.css` and `LayoutV2.css`:

```css
/* SidebarV2.css */
.sidebar-v2 {
  width: 250px; /* Change from 224px */
}

/* LayoutV2.css */
.layout-main {
  margin-left: 250px; /* Match sidebar width */
}
```

### Adding Icons to Menu Items

1. Import icon from `@coreui/icons`
2. Add icon prop to menu item structure
3. Render icon in `SidebarMenuItem` component

## 🐛 Troubleshooting

### Sidebar Not Showing

- Check if route is wrapped with `LayoutV2`
- Verify sidebar width in CSS
- Check z-index conflicts

### Dropdowns Not Working

- Ensure CoreUI CSS is imported
- Check dropdown component imports
- Verify JavaScript is enabled

### Responsive Issues

- Clear browser cache
- Check viewport meta tag
- Test in different browsers

## 📋 TODO

- [ ] Add real notification data
- [ ] Integrate with authentication context
- [ ] Add user avatar upload
- [ ] Implement dark mode
- [ ] Add keyboard navigation
- [ ] Add accessibility improvements (ARIA labels)
- [ ] Add unit tests

## 🔗 Related Files

- Pages: `src/pages-v2/`
- Routes: `src/routes/v2Routes.tsx`
- Contexts: `src/contexts/SchoolContext.tsx`, `src/contexts/CampusContext.tsx`

## 📝 Notes

- This layout uses **CoreUI components** instead of Tailwind
- All styles are **custom CSS** matching the Figma design
- **Mobile-first** approach for responsive design
- Uses existing **School** and **Campus** contexts
- Maintains **React Router** integration
