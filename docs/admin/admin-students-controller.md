# Admin Students Controller

English overview of `/api/admin/v2/students*` endpoints. All require admin auth and read/write directly in MongoDB via Mongoose models: User, BlockHistory, WalkInvite, Report, Idea. Deletions are soft (flags on User); bans/locks reuse ban fields.

## Endpoints and data sources

1. List students: `/api/admin/v2/students` (GET)

- Implementation: [src/controllers/admin/students.controller.ts](src/controllers/admin/students.controller.ts#L114) | [src/services/admin/students.service.ts](src/services/admin/students.service.ts#L9)
- Query params: `page` (default 1), `limit` (default 10), `search` (name/email/id regex), `status` (`active | deactivated | banned | disengaged`), `sortBy` (`name | email | memberSince | onlineLast | status | ignoredInvitations`), `sortOrder` (`asc | desc`).
- Data: filters role=student. Status filters map to `is_active`, `is_banned`, `is_deleted`; `disengaged` delegates to a WalkInvite aggregation for users who sent ≥2 invites, none accepted, zero peers. Sorting uses collation for name/email. Populates `banned_by`, `deleted_by`, `interest_ids`; combines legacy `interests`. Returns ban/deactivation info, ignored invitations (walks + event invites), report presence, flag fields, and pagination totals.
- Sample JSON:

```json
{
  "data": [
    {
      "id": "653c...",
      "userId": "653c...",
      "name": "Ana",
      "email": "ana@example.com",
      "interests": ["Chess", "Art"],
      "status": "banned",
      "memberSince": "10/09/2024",
      "onlineLast": "10/15/2024, 14:30:00",
      "isFlagged": true,
      "flagReason": "Spam reports",
      "deactivatedDate": null,
      "deactivatedBy": "admin@example.com",
      "bannedDate": "10/15/2024",
      "bannedBy": "Moderator",
      "bannedByEmail": "mod@example.com",
      "bannedTime": "02:30 PM",
      "reason": "Harassment",
      "duration": "7 days",
      "totalPeers": 0,
      "ignoredInvitations": 4,
      "reported": true
    }
  ],
  "total": 120,
  "page": 1,
  "limit": 10
}
```

2. Student stats: `/api/admin/v2/students/stats` (GET)

- Implementation: [src/controllers/admin/students.controller.ts](src/controllers/admin/students.controller.ts#L176) | [src/services/admin/students.service.ts](src/services/admin/students.service.ts#L154)
- Query params: optional `schoolId`, `campusId` (filters base query).
- Data: counts total students, students with app access (`is_active` true and not banned), and permanent bans (`ban_duration` null). Compares to counts as of the start of the current month to return deltas.
- Sample JSON:

```json
{
  "totalStudents": 2350,
  "totalStudentsFromLastMonth": 120,
  "studentsWithAppAccess": 2210,
  "studentsWithAppAccessFromLastMonth": 95,
  "totalPermanentBans": 14,
  "totalPermanentBansFromLastMonth": 2
}
```

3. Student details: `/api/admin/v2/students/{id}` (GET)

- Implementation: [src/controllers/admin/students.controller.ts](src/controllers/admin/students.controller.ts#L305) | [src/services/admin/students.service.ts](src/services/admin/students.service.ts#L207)
- Data: loads user with ban/delete populates, ban history, block history (current blockers with timestamps from BlockHistory unless migrated), report history (reports against user with idea titles if present), and basic profile fields. Status reflects ban/active flags; includes banner info (`bannedBy`, `bannedByEmail`, `banReason`, `banDuration`, `banEndDate`).
- Sample JSON:

```json
{
  "id": "653c...",
  "name": "Ana Silva",
  "email": "ana@example.com",
  "avatar": "https://.../avatar.png",
  "status": "active",
  "memberSince": "10/09/2024",
  "areaOfStudy": "Computer Science",
  "lastLogin": "2024-10-15T17:30:00.000Z",
  "bio": "I like chess",
  "interests": ["Chess", "Art"],
  "totalPeers": 3,
  "isBanned": false,
  "banHistory": [
    {
      "title": "Account Banned",
      "duration": "7 days",
      "reason": "Spam",
      "bannedDate": "10/10/2024",
      "bannedBy": "Moderator"
    }
  ],
  "blockedByUsers": [
    {
      "id": "64ff...",
      "name": "Bob Lee",
      "avatar": "https://.../avatar2.png",
      "date": "10/11/2024",
      "reason": "Harassment"
    }
  ],
  "reportHistory": [
    {
      "reportedIdea": "Weekly Blitz",
      "reportId": "77aa...",
      "reason": "Spam",
      "reportedDate": "10/12/2024",
      "reportedBy": "Jane Doe",
      "status": "Under Review"
    }
  ]
}
```

4. Delete student (soft deactivate): `/api/admin/v2/students/{id}` (DELETE)

- Implementation: [src/controllers/admin/students.controller.ts](src/controllers/admin/students.controller.ts#L334) | [src/services/admin/students.service.ts](src/services/admin/students.service.ts#L360)
- Data: sets `is_active=false`, `deleted_at` timestamp, `deleted_by` admin; no hard delete or email side effects.
- Sample JSON:

```json
{ "message": "Student deleted successfully" }
```

5. Activate student: `/api/admin/v2/students/{id}/activate` (POST)

- Implementation: [src/controllers/admin/students.controller.ts](src/controllers/admin/students.controller.ts#L364) | [src/services/admin/students.service.ts](src/services/admin/students.service.ts#L368)
- Data: restores `is_active=true`, clears delete metadata.
- Sample JSON:

```json
{ "message": "Student activated successfully" }
```

6. Unlock student: `/api/admin/v2/students/{id}/unlock` (POST)

- Implementation: [src/controllers/admin/students.controller.ts](src/controllers/admin/students.controller.ts#L393) | [src/services/admin/students.service.ts](src/services/admin/students.service.ts#L376)
- Data: clears ban fields (`is_banned`, `ban_date`, `ban_reason`, `ban_duration`, `ban_expires_at`).
- Sample JSON:

```json
{ "message": "Student unlocked successfully" }
```

7. Unban student: `/api/admin/v2/students/{id}/unban` (POST)

- Implementation: [src/controllers/admin/students.controller.ts](src/controllers/admin/students.controller.ts#L422) | [src/services/admin/students.service.ts](src/services/admin/students.service.ts#L386)
- Data: same as unlock; kept separately for semantic clarity/auditing.
- Sample JSON:

```json
{ "message": "Student unbanned successfully" }
```

8. Ban history: `/api/admin/v2/students/{id}/ban-history` (GET)

- Implementation: [src/controllers/admin/students.controller.ts](src/controllers/admin/students.controller.ts#L464) | [src/services/admin/students.service.ts](src/services/admin/students.service.ts#L397)
- Data: returns populated `ban_history` entries with who banned, reason, duration.
- Sample JSON:

```json
[
  {
    "banned_at": "2024-10-10T19:00:00.000Z",
    "reason": "Spam",
    "banned_by": { "first_name": "Mod", "last_name": "One" },
    "duration": 7
  }
]
```

9. Lock settings: `/api/admin/v2/students/{id}/lock-settings` (PUT)

- Implementation: [src/controllers/admin/students.controller.ts](src/controllers/admin/students.controller.ts#L507) | [src/services/admin/students.service.ts](src/services/admin/students.service.ts#L403)
- Body: `isLocked` (boolean), `lockReason` (string), `lockDuration` (days, optional).
- Data: if `isLocked` true, sets ban fields, optional expiration, and appends to `ban_history` with admin as banner; if false, unlocks (clears ban fields). Returns message only.
- Sample JSON:

```json
{ "message": "Student lock settings updated successfully" }
```

## Notes

- Disengaged filter: WalkInvite aggregation finds senders with ≥2 invites and zero accepted; only students with zero peers are included, sorted by ignored count before pagination. See [src/services/admin/students.service.ts](src/services/admin/students.service.ts#L450).
- Flags and reports: list responses surface `isFlagged`/`flagReason` from user fields; `reported` comes from `report_count > 0`. Details include full `reportHistory` and `blockedByUsers` with best-effort timestamps.
- Sorting: `sortBy` maps to DB fields (`name`→`first_name`, `onlineLast`→`lastLogin`, etc.); text sorts use case-insensitive collation.
- Soft actions: delete/activate toggle `is_active`; unlock/unban clear bans; lock settings use the same ban fields with optional duration.
