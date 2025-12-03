# Events Manager

Events management page with list and calendar view modes.

## Features

✅ **List View** - Table showing all events with sorting
✅ **Calendar View** - Coming soon
✅ **Search** - Filter events by name
✅ **Type Filter** - Filter by Public/Private events
✅ **Pagination** - Navigate through event pages
✅ **Event Actions** - View, Edit, Delete via dropdown menu
✅ **Copy Student ID** - One-click copy to clipboard

## Components

### EventsManager

Main page component with view toggle, filters, and pagination.

**Props:** None (uses mock data currently)

### EventTable

Table component displaying event data with sorting.

**Props:**

- `events: EventData[]` - Array of event objects

### EventTypeChip

Chip component for Public/Private event types.

**Props:**

- `type: EventType` - Either "public" or "private"

## Data Structure

```typescript
interface EventData {
  id: string;
  eventName: string;
  organizer: {
    name: string;
    avatar?: string;
  };
  studentId: string;
  eventDate: string;
  eventTime: string;
  attendees: number;
  type: EventType; // "public" | "private"
}
```

## Styling

All components follow Figma design specifications:

- **Lato** font family
- **Line height:** 100%
- **Colors:**
  - Public events: Green (#d6e9c7 bg, #3b7809 text)
  - Private events: Blue (#c1d0f5 bg, #0e3eb8 text)
  - Purple accent: #546fd9
  - Attendees badge: #526ac9

## Usage

```typescript
import { EventsManager } from "../pages-v2/Events";

// In your route:
<Route path="events" element={<EventsManager />} />;
```

## Routes

- `/v2/events` - Events Manager (List view)
- `/v2/events/insights` - Events Insights (Coming soon)

## TODO

- [x] Connect to real API
- [x] Implement Calendar view
- [ ] Add create event functionality
- [ ] Add edit event modal
- [ ] Add delete confirmation modal
- [ ] Implement view event details modal
- [ ] Add export functionality
- [ ] Add bulk actions
