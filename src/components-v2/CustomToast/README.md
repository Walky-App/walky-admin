# CustomToast Component

A custom success toast notification component following Figma design specifications.

## Features

- ✅ Green left border (#1c9e3e)
- ✅ Success icon with green background (#429b5f)
- ✅ White check icon
- ✅ Close button with X icon
- ✅ Auto-dismiss after 3 seconds
- ✅ Slide-in animation from right
- ✅ Fixed position at top-right corner
- ✅ Lato font, 16px, 600 weight, #5b6168 color

## Usage

```tsx
import { CustomToast } from "../../../components-v2";

const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState("");

const handleShowToast = (message: string) => {
  setToastMessage(message);
  setShowToast(true);

  // Auto-hide after 3 seconds
  setTimeout(() => {
    setShowToast(false);
  }, 3000);
};

return (
  <>
    {/* Your content */}

    {showToast && (
      <CustomToast message={toastMessage} onClose={() => setShowToast(false)} />
    )}
  </>
);
```

## Props

| Prop      | Type         | Required | Description                                    |
| --------- | ------------ | -------- | ---------------------------------------------- |
| `message` | `string`     | Yes      | The message to display in the toast            |
| `onClose` | `() => void` | Yes      | Callback function when close button is clicked |

## Example with StudentTable

```tsx
const handleSendEmail = (student: StudentData) => {
  // Copy email to clipboard
  navigator.clipboard.writeText(student.email);

  // Show toast
  setToastMessage("Email copied to clipboard");
  setShowToast(true);

  // Auto-hide after 3 seconds
  setTimeout(() => {
    setShowToast(false);
  }, 3000);
};
```

## Design Specifications

- **Position**: Fixed top-right (24px from top and right)
- **Border**: 5px solid green (#1c9e3e) on left
- **Border Radius**: 4px
- **Padding**: 16px on top/bottom, 32px on left, 16px on right
- **Background**: White (#ffffff)
- **Shadow**: 0 4px 12px rgba(0, 0, 0, 0.15)
- **Min Width**: 350px
- **Animation**: Slide in from right (0.3s ease-out)
- **Auto-dismiss**: 3 seconds (3000ms)

## Icon Specifications

### Success Icon

- **Size**: 40px × 40px
- **Background**: Green circle (#429b5f)
- **Icon**: White check mark (21px)

### Close Icon

- **Size**: 16px × 16px
- **Color**: Dark grey (#5b6168)
- **Hover**: Opacity 0.7

## Styling

The component uses a separate CSS file (`CustomToast.css`) with all styles defined following the Figma design specifications. No inline styles are used except for specific overrides.

## Implementation Details

1. **Fixed Positioning**: Uses `position: fixed` with `z-index: 9999` to appear above all content
2. **Animation**: CSS keyframes for smooth slide-in effect
3. **Flexbox Layout**: Uses flexbox for internal layout
4. **Icon Integration**: Uses AssetIcon component for check and close icons
5. **Responsive**: Maintains minimum width but can grow with longer messages

## Accessibility

- Close button has proper cursor pointer
- Hover states for interactive elements
- Semantic HTML structure
- Clear visual hierarchy

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS animations supported
- Flexbox layout support required
