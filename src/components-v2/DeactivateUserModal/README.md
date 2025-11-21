# DeactivateUserModal Component

A confirmation modal for deactivating users in the Walky Admin Portal. This modal warns administrators that the user will be notified via email and that the action can be reversed later.

## Design

Based on Figma design:

- File: [Walky Admin Portal](https://www.figma.com/design/Kthn7Wm5T1Bhcb5GuzLfV0/Walky-Admin-Portal?node-id=1717-62632)
- Node: `1717:62632`

## Features

- **Confirmation Dialog**: Displays information about what deactivating a user means
- **Email Notification**: Informs admin that user will be notified via email
- **Reversible Action**: States that the action can be reversed later
- **User Name Display**: Shows the specific user name being deactivated
- **Accessible**: Includes proper focus management and keyboard support
- **Dark Mode Support**: Fully styled for both light and dark themes
- **Responsive**: Adapts to mobile and tablet screens

## Usage

```tsx
import { DeactivateUserModal } from "@/components-v2";

function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDeactivateUser = () => {
    // Deactivate the user
    console.log("User deactivated:", selectedUser);
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
        Deactivate User
      </button>

      <DeactivateUserModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeactivateUser}
        userName={selectedUser?.name}
      />
    </>
  );
}
```

## Props

| Prop        | Type         | Required | Description                                                  |
| ----------- | ------------ | -------- | ------------------------------------------------------------ |
| `visible`   | `boolean`    | Yes      | Controls modal visibility                                    |
| `onClose`   | `() => void` | Yes      | Callback when modal is closed/cancelled                      |
| `onConfirm` | `() => void` | Yes      | Callback when user confirms deactivation                     |
| `userName`  | `string`     | No       | Name of the user being deactivated (defaults to "this user") |

## Behavior

### User Name Display

The modal displays: "Are you sure you want to deactivate **{userName}**?"

- If `userName` is provided, it shows in bold
- If not provided, displays "this user" instead

### Button Actions

- **Cancel**: Closes the modal without taking action
- **Deactivate user**: Executes the `onConfirm` callback to deactivate the user

### Email Notification

The modal automatically informs the admin that:

> "The selected student will be notified via email about the deactivation of their account. This action can be reversed later if needed."

## Styling

The component uses V2 design tokens from `src/styles-v2/design-tokens.css`:

- **Title**: Lato Bold 24px, line-height 100%
- **Question**: Lato Regular 18px with opacity 0.826
- **Username**: Lato Bold 18px (highlighted)
- **Description**: Lato Regular 14px, dark grey color
- **Buttons**: Lato Semibold 16px
- **Confirm Button**: Black background (#1D1B20)
- **Spacing**: 46px between content and buttons

## Accessibility

- Modal has proper ARIA attributes via CoreUI's CModal
- Close button is keyboard accessible
- Focus is trapped within the modal when open
- ESC key closes the modal (via CoreUI default behavior)

## Dark Mode

The component automatically adapts to dark mode:

- Confirm button changes to white background with black text in dark mode
- All text colors adjust to appropriate contrast levels

## Integration

The modal is integrated into all student management pages via the `StudentTable` component:

- Active Students
- Banned Students
- Deactivated Students
- Disengaged Students

When clicking "Deactivate user" in the dropdown menu, this modal appears automatically.

## TODO: API Integration

The component is ready for API integration. Add your deactivation logic here:

```tsx
// In StudentTable.tsx or parent component
const handleConfirmDeactivate = async () => {
  if (!studentToDeactivate) return;

  try {
    await deactivateUserAPI(studentToDeactivate.id);
    // Show success message
    // Refresh student list
  } catch (error) {
    // Show error message
  }

  setDeactivateModalVisible(false);
  setStudentToDeactivate(null);
};
```

## Dependencies

- `@coreui/react`: Modal components
- `AssetIcon`: For the close icon (x-icon)
