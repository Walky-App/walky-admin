# Admin Events Controller

English overview of `/api/admin/v2/events*` endpoints. All require admin auth. Data comes directly from MongoDB via models (Event, Space, User) through `adminEventService`; no mocks or cache. Soft delete is used for admin deletions.

## Endpoints and data sources

1. List events: `/api/admin/v2/events` (GET)

- Implementation: [src/controllers/admin/events.controller.ts#L45](../../src/controllers/admin/events.controller.ts#L45), service [src/services/admin/events.service.ts#L1](../../src/services/admin/events.service.ts#L1).
- Query params: `page` (default 1), `limit` (default 10), `search`, `type` (`public|private|indoor|outdoor|all`), `status` (`all|upcoming|ongoing|finished`), `timezone` (IANA, default UTC for status calc), `startDate`, `endDate`, `campusId`, `schoolId`, `sortBy` (`eventName|eventDate|attendeesCount|type`), `sortOrder` (`asc|desc`).
- Data: filters events; status windows computed per timezone; can filter by campus (via campusId on event, creator campus, or space campus) and school_id; search by regex or ObjectId; date range filter merges with status filter; type maps to visibility or event_type. Sorting supports attendeesCount via aggregation. Returns mapped fields (organizer info, attendees count, derived status, etc.).
- Sample JSON:

```json
{
  "data": [
    {
      "id": "eventId",
      "eventName": "Welcome Fair",
      "organizer": { "name": "Alice", "avatar": "" },
      "studentId": "userId",
      "eventDate": "10/01/2025",
      "eventTime": "14:00",
      "start_date": "2025-10-01T14:00:00.000Z",
      "end_date": "2025-10-01T15:00:00.000Z",
      "attendeesCount": 42,
      "attendees": [{ "user_id": "u1", "status": "going" }],
      "type": "public",
      "location": "Library",
      "description": "...",
      "slots": 100,
      "image_url": "https://...",
      "isFlagged": false,
      "flagReason": null,
      "status": "upcoming"
    }
  ],
  "total": 120,
  "page": 1,
  "limit": 10
}
```

2. Get event details: `/api/admin/v2/events/{id}` (GET)

- Implementation: [src/controllers/admin/events.controller.ts#L108](../../src/controllers/admin/events.controller.ts#L108), service [src/services/admin/events.service.ts#L146](../../src/services/admin/events.service.ts#L146).
- Data: fetches event with creator, school, participants populated; enriches organizer info (user or space), includes space details when ownerType=space, calculates `attendeesCount`, normalizes image_url (empty if file://). Throws if not found.
- Sample JSON:

```json
{
  "id": "eventId",
  "name": "Welcome Fair",
  "organizer": { "name": "Space A", "avatar": "" },
  "space": { "id": "spaceId", "name": "Space A" },
  "attendeesCount": 42,
  "participants": [{ "user_id": "u1", "name": "Bob", "status": "going" }]
}
```

3. Delete event: `/api/admin/v2/events/{id}` (DELETE)

- Implementation: [src/controllers/admin/events.controller.ts#L156](../../src/controllers/admin/events.controller.ts#L156), service [src/services/admin/events.service.ts#L214](../../src/services/admin/events.service.ts#L214).
- Body: optional `reason` (included in email notification).
- Data: soft deletes event (`deletedAt`, `deleteReason='admin'`, `is_active=false`); sends email to creator via SendGrid if email is present. Throws if event not found.
- Sample JSON:

```json
{ "message": "Event deleted successfully" }
```

## Data reliability

- All endpoints hit real MongoDB collections via Mongoose models Event, Space, User. No caching/mocks.
- Status is computed server-side using `timezone` parameter; date filters can combine with status window.
- Soft delete preserves record while hiding it; admin deletions are marked with `deleteReason='admin'`.
- Sort by attendeesCount uses aggregation to derive counts; other sorts use indexed fields with collation for case-insensitive names.
