# BanUserModal Component

A comprehensive modal for banning users in the Walky Admin Portal. This modal allows administrators to select ban duration, provide a reason, and optionally resolve all related reports.

## Design

Based on Figma designs:

- Modal: [Walky Admin Portal](https://www.figma.com/design/Kthn7Wm5T1Bhcb5GuzLfV0/Walky-Admin-Portal?node-id=1717-62679)
- Dropdown: [Duration Selector](https://www.figma.com/design/Kthn7Wm5T1Bhcb5GuzLfV0/Walky-Admin-Portal?node-id=1717-63051)

## Features

- **Ban Duration Dropdown**: Custom styled dropdown with 6 options (1, 3, 7, 14, 30, 90 days)
- **Ban Reason Field**: Multi-line textarea for detailed ban reasoning
- **Resolve Reports Checkbox**: Option to automatically resolve all related reports
- **Form Validation**: Requires ban reason before submission
- **Accessible**: Keyboard navigation, focus management, click-outside-to-close
- **Dark Mode Support**: Fully styled for both light and dark themes
- **Responsive**: Adapts to mobile and tablet screens

## Usage

```tsx
import { BanUserModal } from "@/components-v2";

function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleBanUser = (duration, reason, resolveReports) => {
    console.log("Ban Duration:", duration);
    console.log("Ban Reason:", reason);
    console.log("Resolve Reports:", resolveReports);

    // Call API to ban user
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => {
          setSelectedUser({ name: "Austin Smith" });
          setShowModal(true);
        }}
      >
        Ban User
      </button>

      <BanUserModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleBanUser}
        userName={selectedUser?.name}
      />
    </>
  );
}
```

## Props

| Prop        | Type                                                                  | Required | Description                                                |
| ----------- | --------------------------------------------------------------------- | -------- | ---------------------------------------------------------- |
| `visible`   | `boolean`                                                             | Yes      | Controls modal visibility                                  |
| `onClose`   | `() => void`                                                          | Yes      | Callback when modal is closed/cancelled                    |
| `onConfirm` | `(duration: string, reason: string, resolveReports: boolean) => void` | Yes      | Callback with ban details when confirmed                   |
| `userName`  | `string`                                                              | No       | Name of the user being banned (for future display/logging) |

## Ban Duration Options

The dropdown provides 6 preset durations:

- 1 Day
- 3 Days
- 7 Days
- 14 Days
- 30 Days
- 90 Days

Default: **1 Day**

## Form Fields

### Ban Duration (Required - Dropdown)

- **Label**: "Ban duration" (Bold)
- **Type**: Custom dropdown with icon
- **Default**: "1 Day"
- **Validation**: Always has a value (required)

### Ban Reason (Required - Textarea)

- **Label**: "Ban reason" (Bold)
- **Type**: Multi-line textarea
- **Placeholder**: "Enter reason for ban"
- **Height**: 171px (5 rows)
- **Validation**: Cannot be empty - submit button disabled until filled

### Resolve Reports (Optional - Checkbox)

- **Label**: "Resolve all related reports for this user"
- **Default**: Checked (true)
- **Purpose**: Automatically resolves all pending reports for the user

## Behavior

### Dropdown Interaction

1. Click to open dropdown menu
2. Click outside to close dropdown
3. Click option to select and close
4. Selected option highlighted in purple with background
5. Arrow icon rotates when open

### Form Validation

- Submit button is **disabled** until a ban reason is entered
- Visual feedback on disabled state (opacity: 0.5)
- No validation errors shown, just button disabled

### Reset on Close

When modal closes (cancel or after submit), all fields reset to defaults:

- Duration: "1 Day"
- Reason: "" (empty)
- Resolve Reports: true (checked)
- Dropdown: closed

## Styling

The component uses V2 design tokens from `src/styles-v2/design-tokens.css`:

- **Title**: Lato Bold 24px, line-height 100%
- **Labels**: Lato Bold 16px
- **Inputs**: Lato Regular 16px
- **Dropdown Items**: Lato Regular 14px
- **Buttons**: Lato Semibold 16px
- **Confirm Button**: Error red (#D53425)
- **Modal Width**: 590px (654px with padding)
- **Spacing**: 46px between sections, 24px between fields

### Dropdown Styling

- White background with border
- Purple border on hover
- Selected item: purple text with light blue background
- Dividers between items
- Smooth open/close animation

## Accessibility

- Modal has proper ARIA attributes via CoreUI's CModal
- Close button is keyboard accessible
- Dropdown is keyboard navigable (click to open, arrow keys to navigate)
- Focus is trapped within the modal when open
- ESC key closes the modal and dropdown
- All interactive elements have focus states

## Dark Mode

The component automatically adapts to dark mode:

- Background colors adjust to dark theme
- Text colors adjust for proper contrast
- Dropdown menu background changes
- Border colors adapt
- Maintain confirm button red in both modes

## Integration

The modal is integrated into all student management pages via the `StudentTable` component:

- ✅ Active Students
- ✅ Banned Students
- ✅ Deactivated Students
- ✅ Disengaged Students

When clicking "Ban user" in the dropdown menu, this modal appears automatically.

## API Integration Example

```tsx
const handleConfirmBan = async (
  duration: string,
  reason: string,
  resolveReports: boolean
) => {
  if (!studentToBan) return;

  try {
    await banUserAPI(studentToBan.id, {
      duration,
      reason,
      resolveReports,
    });

    // Show success toast
    showToast("User banned successfully", "success");

    // Refresh student list
    refetchStudents();
  } catch (error) {
    // Show error toast
    showToast("Failed to ban user", "error");
  }

  setBanModalVisible(false);
  setStudentToBan(null);
};
```

## Dependencies

- `@coreui/react`: Modal and Button components
- `AssetIcon`: For close icon (x-icon) and dropdown arrow (arrow-down)
- React hooks: useState, useRef, useEffect

## Notes

- The `userName` prop is currently not displayed in the modal but can be used for logging or future enhancements
- Dropdown closes automatically when clicking outside or selecting an option
- Form resets to defaults on every close to prevent data persistence between uses
- Submit button disabled state provides clear UX feedback
