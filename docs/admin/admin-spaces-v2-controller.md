# Admin Spaces V2 Controller

English overview of `/api/admin/v2/spaces*` endpoints. All require admin auth. Data comes directly from MongoDB via Mongoose models: Space, SpaceCategory, SpaceMember, Event, Report; emails are sent with the SendGrid helper. Soft deletes use the `deletedAt` field.

## Endpoints and data sources

1. List spaces: `/api/admin/v2/spaces` (GET)

- Implementation: [src/controllers/admin/spaces.controller.ts](../../src/controllers/admin/spaces.controller.ts)
- Query params: `page` (default 1), `limit` (default 10), `search` (matches ObjectId or title regex), `category` (ObjectId or slug; `all` disables filter), `sortBy` (`spaceName | members | creationDate | category`), `sortOrder` (`asc | desc`).
- Data: filters active spaces (`deletedAt: null`), resolves category slug to id when needed, paginates and sorts, populates owner (name, avatar) and category name, counts pending/under_review reports to flag items. Response includes counts for events (from `eventIds`), members, creation date/time strings, flag reason from space or report.
- Sample JSON:

```json
{
  "data": [
    {
      "id": "653c...",
      "spaceName": "Chess Club",
      "owner": { "name": "Ana", "avatar": "https://.../avatar.png" },
      "studentId": "64ff...",
      "events": 2,
      "members": 48,
      "creationDate": "10/09/2024",
      "creationTime": "14:30",
      "category": "Student Life",
      "isFlagged": true,
      "flagReason": "Reported as spam"
    }
  ],
  "total": 120,
  "page": 1,
  "limit": 10
}
```

2. Insights: `/api/admin/v2/spaces/insights` (GET)

- Implementation: [src/controllers/admin/spaces.controller.ts](../../src/controllers/admin/spaces.controller.ts)
- Query params: `period` = `all | week | month` (defaults to `month`).
- Data: counts spaces created in window (ignores deleted), counts joined members (SpaceMember state `joined`, not deleted), aggregates top 5 categories with share of total, and top 5 spaces either by total members (`all`) or member growth in the window (`week`/`month`).
- Sample JSON:

```json
{
  "totalSpaces": 235,
  "totalMembers": 4210,
  "popularCategories": [
    { "name": "Arts", "emoji": "🎨", "imageUrl": "https://.../arts.png", "spaces": 34, "percentage": 14.5 }
  ],
  "topSpaces": [{ "rank": 1, "name": "Chess Club", "logo": "https://.../logo.png", "members": 312 }]
}
```

3. Space details: `/api/admin/v2/spaces/{id}` (GET)

- Implementation: [src/controllers/admin/spaces.controller.ts](../../src/controllers/admin/spaces.controller.ts)
- Data: loads space with owner (name, avatar, email), category name, campus name; returns joined members (first 50) and events owned by or linked to the space (includes deleted events). Maps fields for admin UI (`cover_image_url`, `logo_url`, `description`, etc.). Flags spaces with pending/under_review reports and surfaces `flagReason`.
- Sample JSON:

```json
{
  "id": "653c...",
  "name": "Chess Club",
  "description": "Weekly meetups",
  "logo_url": "https://.../logo.png",
  "cover_image_url": "https://.../cover.png",
  "owner": { "name": "Ana", "avatar": "https://.../avatar.png", "studentId": "64ff..." },
  "category": { "_id": "64aa...", "name": "Student Life" },
  "campusName": "Main Campus",
  "members": [{ "user_id": "64ff...", "name": "Ana", "avatar_url": "https://.../avatar.png" }],
  "events": [
    {
      "id": "77aa...",
      "name": "Weekly Blitz",
      "date": "2024-10-10T19:00:00.000Z",
      "location": "Room 101",
      "image_url": "https://.../event.png"
    }
  ],
  "isFlagged": false,
  "flagReason": null,
  "about": "Club for chess lovers",
  "chapter": "001",
  "contact": "club@example.com",
  "howWeUse": "Meetups",
  "memberRange": "11-50",
  "yearEstablished": 2022,
  "governingBody": "Student Org",
  "primaryFocus": "Strategy"
}
```

4. Delete space: `/api/admin/v2/spaces/{id}` (DELETE)

- Implementation: [src/controllers/admin/spaces.controller.ts](../../src/controllers/admin/spaces.controller.ts)
- Body: optional `reason` (used in email to owner when available).
- Data: soft-deletes space (`deletedAt` set). If owner email exists, sends deletion email via SendGrid helper; email failures are logged but do not fail the request.
- Sample JSON:

```json
{ "message": "Space deleted successfully" }
```

5. Update space: `/api/admin/v2/spaces/{id}` (PATCH)

- Implementation: [src/controllers/admin/spaces.controller.ts](../../src/controllers/admin/spaces.controller.ts)
- Body: any subset of `category`, `title`, `description` (passes through to `findByIdAndUpdate` with validation).
- Data: returns 404 when space is missing; otherwise returns updated document with populated category name and owner basic fields.
- Sample JSON:

```json
{
  "message": "Space updated successfully",
  "space": { "_id": "653c...", "title": "Chess Club", "category": { "_id": "64aa...", "name": "Student Life" } }
}
```

## Notes

- Flagging: `isFlagged`/`flagReason` derive from space fields or any pending/under_review report for the space.
- Sorting: `sortBy` maps to database fields (`spaceName`→`title`, `members`→`membersCount`, `creationDate`→`createdAt`, `category`→`category`) with case-insensitive collation.
- Category slugs: frontend slugs like `academics-and-honors` are resolved to SpaceCategory names by normalizing `&`→`and` and spaces→`-`; unknown slugs return empty results.
- Soft deletes: only `deletedAt: null` spaces and members are listed; delete operations do not hard-remove records.
