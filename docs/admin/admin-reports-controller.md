# Admin Reports Controller

English overview of `/api/admin/v2/reports*` endpoints. All require admin auth. Data comes directly from MongoDB via models (Report, User, Event, Idea, Space, Message, BlockHistory) through `adminReportService`; no mocks or cache. Reports retain polymorphic links to reported items and keep snapshots/notes.

## Endpoints and data sources

1. List reports: `/api/admin/v2/reports` (GET)

- Implementation: [src/controllers/admin/reports.controller.ts#L45](../../src/controllers/admin/reports.controller.ts#L45), service [src/services/admin/reports.service.ts#L1](../../src/services/admin/reports.service.ts#L1).
- Query params: `page` (default 1), `limit` (default 10), `search` (regex on description/reason or ObjectId), `type` (comma list or single: user|event|idea|space|message|all), `status` (comma list; normalized to pending/under_review/resolved/dismissed), `schoolId`, `campusId`, `period` (all|week|month|year), `sortBy` (reportDate|type|status|reason), `sortOrder` (asc|desc).
- Data: filters by campus/school, period window (createdAt), type, status (case-insensitive regex), search; sorts with collation. Fetches flag state for reported items (User/Event/Idea/Space) to surface `isFlagged`/`flagReason`. Returns reporter info and normalized reason/status labels.
- Sample JSON:

```json
{
  "data": [
    {
      "id": "repId",
      "description": "User sent spam",
      "studentId": "reporterId",
      "reportedItemId": "targetId",
      "reportDate": "2025-10-01T10:00:00.000Z",
      "resolvedAt": null,
      "type": "User",
      "reason": "Harassment threats",
      "reasonTag": "Harassment threats",
      "reporterName": "Alice",
      "status": "Pending review",
      "isFlagged": false,
      "flagReason": null
    }
  ],
  "total": 120,
  "page": 1,
  "limit": 10
}
```

2. Report stats: `/api/admin/v2/reports/stats` (GET)

- Implementation: [src/controllers/admin/reports.controller.ts#L100](../../src/controllers/admin/reports.controller.ts#L100), service [src/services/admin/reports.service.ts#L93](../../src/services/admin/reports.service.ts#L93).
- Data: counts total, pending, underEvaluation, resolved, dismissed from Report collection.
- Sample JSON:

```json
{ "total": 120, "pending": 30, "underEvaluation": 20, "resolved": 60, "dismissed": 10 }
```

3. Bulk update: `/api/admin/v2/reports/bulk-update` (PUT)

- Implementation: [src/controllers/admin/reports.controller.ts#L131](../../src/controllers/admin/reports.controller.ts#L131), service [src/services/admin/reports.service.ts#L333](../../src/services/admin/reports.service.ts#L333).
- Body: `reportIds` (array), `status` (normalized to pending|under_review|resolved|dismissed). Sets `resolved_at` when resolved/dismissed.
- Sample JSON:

```json
{ "message": "Reports updated successfully" }
```

4. Get details: `/api/admin/v2/reports/{id}` (GET)

- Implementation: [src/controllers/admin/reports.controller.ts#L170](../../src/controllers/admin/reports.controller.ts#L170), service [src/services/admin/reports.service.ts#L118](../../src/services/admin/reports.service.ts#L118).
- Data: populates reporter and reviewer; loads reported content depending on `report_type` (user, event, idea, space, message). For user-related items, fetches `reportedUser` info with ban status/history. Includes `content` snapshot (event/idea/space/message details), `safetyRecord` (banHistory, reportHistory across all user content, blockHistory via BlockHistory helper), admin notes, and original `reported_item_snapshot`.
- Sample JSON (abridged):

```json
{
  "id": "repId",
  "description": "Spam message",
  "reporter": { "id": "u1", "name": "Alice", "avatar": "" },
  "reportedUser": { "id": "u2", "name": "Bob", "isBanned": false, "isDeactivated": false },
  "reportDate": "2025-10-01T10:00:00.000Z",
  "type": "message",
  "reason": "Spam",
  "status": "Pending review",
  "notes": [{ "note": "investigating", "date": "2025-10-02T12:00:00.000Z" }],
  "content": { "message": { "text": "buy now", "timestamp": "10/01/2025" } },
  "safetyRecord": {
    "banHistory": [],
    "reportHistory": [{ "reportedContent": "Message", "reason": "Spam" }],
    "blockHistory": []
  },
  "snapshot": { "...": "original snapshot data if present" }
}
```

5. Update status: `/api/admin/v2/reports/{id}/status` (PATCH)

- Implementation: [src/controllers/admin/reports.controller.ts#L217](../../src/controllers/admin/reports.controller.ts#L217), service [src/services/admin/reports.service.ts#L279](../../src/services/admin/reports.service.ts#L279).
- Body: `status` (normalized; sets `resolved_at` for resolved/dismissed). Returns updated report.
- Sample JSON:

```json
{ "_id": "repId", "status": "resolved", "resolved_at": "2025-10-02T12:00:00.000Z" }
```

6. Add note: `/api/admin/v2/reports/{id}/note` (POST)

- Implementation: [src/controllers/admin/reports.controller.ts#L245](../../src/controllers/admin/reports.controller.ts#L245), service [src/services/admin/reports.service.ts#L328](../../src/services/admin/reports.service.ts#L328).
- Body: `note` (string). Stores in `admin_notes`; returns updated report.
- Sample JSON:

```json
{ "_id": "repId", "admin_notes": "Needs follow-up" }
```

7. Ban user from report: `/api/admin/v2/reports/{id}/ban-user` (POST)

- Implementation: [src/controllers/admin/reports.controller.ts#L273](../../src/controllers/admin/reports.controller.ts#L273), service [src/services/admin/reports.service.ts#L357](../../src/services/admin/reports.service.ts#L357).
- Body: `reason`, `duration` (days, optional for permanent), uses `adminId` from `req.user`. Determines the user based on report type (reported user, or creator of event/idea/space; message sender). Updates User with ban flags/dates and marks report resolved.
- Sample JSON:

```json
{ "message": "User banned successfully" }
```

## Data reliability and behaviors

- All operations use real MongoDB collections via Mongoose: Report, User, Event, Idea, Space, Message (dynamic import), BlockHistory. No caching or mock layers.
- Status normalization handles varied casing/text (e.g., "Under evaluation" → `under_review`). Invalid statuses throw errors in service.
- Flagging: list endpoint augments each reported item with live `isFlagged`/`flagReason` by fetching the target documents.
- Safety record: details endpoint assembles ban history, all reports about the user or their content, and block history (BlockHistory helper) to give admins context.
- Soft vs hard: Report documents are not deleted here; ideas/events/spaces/users may still carry flags or bans separately.
