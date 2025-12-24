# Admin Ideas Controller

English overview of `/api/admin/v2/ideas*` endpoints. All require admin auth. Data comes directly from MongoDB via models (Idea, User) through `adminIdeaService`; no mocks or cache. Ideas use soft delete (`is_active=false`).

## Endpoints and data sources

1. List ideas: `/api/admin/v2/ideas` (GET)

- Implementation: [src/controllers/admin/ideas.controller.ts#L45](../../src/controllers/admin/ideas.controller.ts#L45), service [src/services/admin/ideas.service.ts#L1](../../src/services/admin/ideas.service.ts#L1).
- Query params: `page` (default 1), `limit` (default 10), `search` (regex or ObjectId), `sortBy` (`ideaTitle|collaborated|creationDate`), `sortOrder` (`asc|desc`), `period` (`week|month` for recent creations).
- Data: filters `is_active=true`, optional period window; search by ID or title; sorting supports collaborator count via aggregation; returns mapped fields (owner, counts, flags). Case-insensitive sort via collation.
- Sample JSON:

```json
{
  "data": [
    {
      "id": "ideaId",
      "ideaTitle": "New App",
      "owner": { "name": "Alice", "avatar": "" },
      "studentId": "userId",
      "collaborated": 3,
      "creationDate": "10/01/2025",
      "creationTime": "14:00",
      "isFlagged": false,
      "flagReason": null
    }
  ],
  "total": 120,
  "page": 1,
  "limit": 10
}
```

2. Get idea details: `/api/admin/v2/ideas/{id}` (GET)

- Implementation: [src/controllers/admin/ideas.controller.ts#L105](../../src/controllers/admin/ideas.controller.ts#L105), service [src/services/admin/ideas.service.ts#L77](../../src/services/admin/ideas.service.ts#L77).
- Data: populates creator (name, avatar, email), school, collaborators; returns `collaboratorsCount`, `lookingFor`, and normalized creator info.
- Sample JSON:

```json
{
  "id": "ideaId",
  "title": "New App",
  "creator": { "name": "Alice", "avatar": "", "studentId": "u1", "email": "a@x.com" },
  "collaborators": [{ "user_id": "u2", "name": "Bob", "status": "accepted" }],
  "collaboratorsCount": 2,
  "lookingFor": "Design help"
}
```

3. Delete idea: `/api/admin/v2/ideas/{id}` (DELETE)

- Implementation: [src/controllers/admin/ideas.controller.ts#L153](../../src/controllers/admin/ideas.controller.ts#L153), service [src/services/admin/ideas.service.ts#L113](../../src/services/admin/ideas.service.ts#L113).
- Body: optional `reason` (emailed to owner).
- Data: soft-deletes idea (`is_active=false`); sends deletion email via SendGrid helper if owner email exists; throws if idea not found.
- Sample JSON:

```json
{ "message": "Idea deleted successfully" }
```

4. Collaborated ideas filter options: `/api/admin/v2/ideas/filter-options/collaborated` (GET)

- Implementation: [src/controllers/admin/ideas.controller.ts#L181](../../src/controllers/admin/ideas.controller.ts#L181), service [src/services/admin/ideas.service.ts#L151](../../src/services/admin/ideas.service.ts#L151).
- Query params: `schoolId`, `campusId` (optional filters).
- Data: returns ideas with at least one collaborator; for campus filter, joins creator to ensure campus match; includes `collaboratorCount`.
- Sample JSON:

```json
[{ "id": "ideaId", "title": "New App", "collaboratorCount": 3 }]
```

## Data reliability

- All endpoints hit real MongoDB collections via Mongoose models Idea and User. No caching/mocks.
- Soft delete preserves the idea document while marking it inactive (`is_active=false`).
- Sorting by collaborator count uses aggregation to compute lengths; other sorts rely on indexed fields with collation for case-insensitive matching.
