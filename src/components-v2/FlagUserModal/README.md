# FlagUserModal Component

A confirmation modal for flagging users in the Walky Admin Portal. This modal warns administrators that flagging a user will make their profile visible to other admins and tracks the user as an important case.

## Design

Based on Figma design:

- File: [Walky Admin Portal](https://www.figma.com/design/Kthn7Wm5T1Bhcb5GuzLfV0/Walky-Admin-Portal?node-id=1717-62643)
- Node: `1717:62643`

## Features

- **Confirmation Dialog**: Displays information about what flagging a user means
- **"Don't Show Again" Option**: Users can opt out of seeing this warning in future sessions
- **LocalStorage Persistence**: Preference is saved across sessions
- **Accessible**: Includes proper focus management and keyboard support
- **Dark Mode Support**: Fully styled for both light and dark themes
- **Responsive**: Adapts to mobile and tablet screens

## Usage

```tsx
import { FlagUserModal } from "@/components-v2";

function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  const handleFlagUser = () => {
    // Flag the user
    console.log("User flagged");
    setShowModal(false);
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>Flag User</button>

      <FlagUserModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleFlagUser}
      />
    </>
  );
}
```

## Props

| Prop        | Type         | Required | Description                             |
| ----------- | ------------ | -------- | --------------------------------------- |
| `visible`   | `boolean`    | Yes      | Controls modal visibility               |
| `onClose`   | `() => void` | Yes      | Callback when modal is closed/cancelled |
| `onConfirm` | `() => void` | Yes      | Callback when user confirms flagging    |

## Behavior

### LocalStorage Key

The modal uses the key `walky-admin-flag-user-hide-message` to store the user's preference.

### Checkbox Behavior

- When checked and the user clicks "Flag user", the preference is saved
- When the user cancels, the preference is **not** saved (even if checked)
- On subsequent uses, if the preference is set to "true", the modal should be skipped entirely

### Button Actions

- **Cancel**: Closes the modal without saving the checkbox preference
- **Flag user**: Executes the `onConfirm` callback and saves the preference if checkbox is checked

## Checking User Preference

To check if the user has opted out of the modal:

```tsx
const shouldShowModal =
  localStorage.getItem("walky-admin-flag-user-hide-message") !== "true";

if (shouldShowModal) {
  setShowFlagModal(true);
} else {
  // Directly flag the user
  handleFlagUser();
}
```

## Styling

The component uses V2 design tokens from `src/styles-v2/design-tokens.css`:

- Colors: `--v2-primary-purple-main`, `--v2-neutral-white`, etc.
- Spacing: `--v2-spacing-*`
- Border radius: `--v2-radius-*`
- Typography: Lato font family with various weights

## Accessibility

- Modal has proper ARIA attributes via CoreUI's CModal
- Close button is keyboard accessible
- Focus is trapped within the modal when open
- ESC key closes the modal (via CoreUI default behavior)

## Dark Mode

The component automatically adapts to dark mode using CSS variables. No additional props needed.

## Dependencies

- `@coreui/react`: Modal components
- `AssetIcon`: For the close icon (x-icon)
