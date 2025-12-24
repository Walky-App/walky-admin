# Admin Space Controller

English overview of `/api/admin/spaces*` endpoints with links to controller. All require admin auth. Data is read/written directly in MongoDB via Mongoose models (Space, SpaceMember, User, Event); no mocks or cache. Soft deletes are used for spaces, events owned by a space, and memberships.

## Endpoints and data sources

1. List spaces: `/api/admin/spaces` (GET)

- Implementation: [src/controllers/admin/adminSpace.controller.ts#L10](../../src/controllers/admin/adminSpace.controller.ts#L10)
- Query params: `campusId`, `category`, `page` (default 1), `limit` (default 20).
- Data: finds active spaces (`deletedAt: null`), filters by campus/category, paginates, populates campus name and owner basic fields. Returns total for pagination.
- Sample JSON:

```json
{
  "success": true,
  "data": [
    {
      "_id": "spaceId",
      "title": "Chess Club",
      "campusId": { "campus_name": "Main" },
      "ownerId": { "first_name": "Ana", "last_name": "Silva", "email": "ana@example.com" }
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 120, "pages": 6 }
}
```

2. Update space: `/api/admin/spaces/{spaceId}` (PATCH)

- Implementation: [src/controllers/admin/adminSpace.controller.ts#L41](../../src/controllers/admin/adminSpace.controller.ts#L41)
- Body: any updatable field (title, description, category, campusId, ownerId, etc.).
- Data: updates Space document with validation; populates campus and owner fields in response. Duplicate title within same campus returns 409 (Mongo duplicate key).
- Sample JSON:

```json
{ "message": "Space updated successfully by admin", "space": { "_id": "spaceId", "title": "New Title" } }
```

3. Transfer ownership: `/api/admin/spaces/{spaceId}/transfer-ownership` (PATCH/POST depending on routing)

- Implementation: [src/controllers/admin/adminSpace.controller.ts#L94](../../src/controllers/admin/adminSpace.controller.ts#L94)
- Body: `newOwnerId` (required).
- Data: validates space exists, new owner exists and belongs to same campus; ensures new owner is (or becomes) a joined member and adjusts counts; keeps old owner as member; updates `ownerId`.
- Sample JSON:

```json
{ "message": "Ownership transferred successfully", "space": { "_id": "spaceId", "ownerId": "newOwnerId" } }
```

4. Soft delete space: `/api/admin/spaces/{spaceId}` (DELETE)

- Implementation: [src/controllers/admin/adminSpace.controller.ts#L158](../../src/controllers/admin/adminSpace.controller.ts#L158)
- Body: optional `reason` (used in email).
- Data: sets `deletedAt` on the space; soft-deletes all events owned by the space and all memberships; sends email to owner via SendGrid helper if available. Does not fail if email sending fails.
- Sample JSON:

```json
{ "message": "Space deleted successfully by admin" }
```

5. Force approve member: `/api/admin/spaces/{spaceId}/members/{userId}/approve` (PATCH/POST)

- Implementation: [src/controllers/admin/adminSpace.controller.ts#L217](../../src/controllers/admin/adminSpace.controller.ts#L217)
- Data: finds or creates SpaceMember (state set to `joined`), updates counts (`membersCount`, `requestsCount`), ensures space exists. Returns membership info; if already joined, returns informational message.
- Sample JSON:

```json
{
  "message": "Membership approved by admin",
  "membership": { "spaceId": "spaceId", "userId": "userId", "state": "joined" }
}
```

6. Force remove member: `/api/admin/spaces/{spaceId}/members/{userId}` (DELETE)

- Implementation: [src/controllers/admin/adminSpace.controller.ts#L270](../../src/controllers/admin/adminSpace.controller.ts#L270)
- Data: rejects removal of owner; soft-deletes membership, adjusts counts (`membersCount` or `requestsCount`), requires space and membership to exist.
- Sample JSON:

```json
{ "message": "Member removed successfully by admin" }
```

## Data reliability

- All operations hit real MongoDB collections through models: Space, SpaceMember, User, Event. No caching or mock layers.
- Soft deletes preserve history while hiding entities: `deletedAt` is set instead of removing documents.
- Campus consistency is enforced for ownership transfers (new owner must share campus with the space).
