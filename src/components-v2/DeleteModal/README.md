# DeleteModal Component

Global delete confirmation modal for Events, Spaces, and Ideas.

## Features

- **Reusable**: Works for Events, Spaces, and Ideas
- **Reason Field**: Required textarea for deletion reason (500 char limit)
- **Character Counter**: Real-time character count
- **Toast Notification**: Success confirmation after deletion
- **Responsive**: Adapts to different screen sizes
- **Accessible**: Keyboard navigation and ARIA labels

## Usage

```typescript
import { DeleteModal } from "../../components-v2";

const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [itemToDelete, setItemToDelete] = useState<YourDataType | null>(null);

const handleDeleteClick = (item: YourDataType) => {
  setItemToDelete(item);
  setDeleteModalOpen(true);
};

const handleDeleteConfirm = (reason: string) => {
  console.log("Deleting:", itemToDelete, "Reason:", reason);
  // Call API to delete
  // Show toast notification
};

<DeleteModal
  isOpen={deleteModalOpen}
  onClose={() => setDeleteModalOpen(false)}
  onConfirm={handleDeleteConfirm}
  itemName={itemToDelete?.name || ""}
  type="event" // or "space" or "idea"
/>;
```

## Props

| Prop        | Type                           | Required | Description                                   |
| ----------- | ------------------------------ | -------- | --------------------------------------------- |
| `isOpen`    | `boolean`                      | Yes      | Controls modal visibility                     |
| `onClose`   | `() => void`                   | Yes      | Callback when modal closes                    |
| `onConfirm` | `(reason: string) => void`     | Yes      | Callback when delete is confirmed with reason |
| `itemName`  | `string`                       | Yes      | Name of the item being deleted                |
| `type`      | `'event' \| 'space' \| 'idea'` | Yes      | Type of item being deleted                    |

## Styling

- **Title**: Lato Bold 24px, #1d1b20
- **Question**: Lato Regular 18px, #1d1b20 (82.6% opacity)
- **Warning**: Lato Regular 14px, #5b6168
- **Textarea**: Lato Regular 16px, border #cac4d0
- **Cancel Button**: White bg, border #d2d2d3
- **Delete Button**: Red #d53425, white text

## Implementation Notes

1. Modal closes automatically after confirmation
2. Reason field is cleared on close
3. Character limit: 500 characters
4. Red delete button indicates destructive action
5. Integrates with CustomToast for success feedback

## Files

- `DeleteModal.tsx` - Main component
- `DeleteModal.css` - Styling (Figma exact specs)
- `index.ts` - Exports

## Current Integration

✅ **Events** - Delete event in EventTable dropdown
⬜ **Spaces** - To be implemented
⬜ **Ideas** - To be implemented
