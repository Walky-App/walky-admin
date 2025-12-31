# Admin Ambassadors Controller

English overview of `/api/admin/ambassadors*` endpoints. All require admin auth. Data is read/written directly in MongoDB via Mongoose models (Ambassador, User); no mocks or cache.

## Endpoints and data sources

1. List all ambassadors: `/api/admin/ambassadors` (GET)

- Implementation: [src/controllers/admin/ambassadors.controller.ts#L22](../../src/controllers/admin/ambassadors.controller.ts#L22)
- Data: fetches all ambassadors. Also loads User documents by email to add `avatar_url` and `is_active` flags. If no ambassadors, returns empty array with `count: 0`.
- Sample JSON:

```json
{
  "success": true,
  "message": "Ambassadors retrieved successfully",
  "data": [
    { "_id": "ambId", "name": "Jane", "email": "jane@school.edu", "avatar_url": "https://...", "user_is_active": true }
  ],
  "count": 1
}
```

2. Get ambassador by ID: `/api/admin/ambassadors/{id}` (GET)

- Implementation: [src/controllers/admin/ambassadors.controller.ts#L62](../../src/controllers/admin/ambassadors.controller.ts#L62)
- Data: finds by `_id`. Returns 400 if missing ID or invalid format, 404 if not found.
- Sample JSON:

```json
{ "success": true, "message": "Ambassador retrieved successfully", "data": { "_id": "ambId", "name": "Jane" } }
```

3. Create ambassador: `/api/admin/ambassadors` (POST)

- Implementation: [src/controllers/admin/ambassadors.controller.ts#L109](../../src/controllers/admin/ambassadors.controller.ts#L109)
- Body: required `name`, `email`; optional fields include `phone`, `student_id`, `campuses_id[]`, `school_id`, `is_active`, `profile_image_url`, `bio`, `graduation_year`, `major`, `user_id`.
- Data: inserts new Ambassador; sets `created_by` from `req.user._id` and `school_id` from body or authenticated user. Strips empty `profile_image_url`. Handles validation errors (400) and duplicate email (409).
- Sample JSON:

```json
{
  "success": true,
  "message": "Ambassador created successfully",
  "data": { "_id": "newAmbId", "email": "jane@school.edu" }
}
```

4. Update ambassador: `/api/admin/ambassadors/{id}` (PUT)

- Implementation: [src/controllers/admin/ambassadors.controller.ts#L187](../../src/controllers/admin/ambassadors.controller.ts#L187)
- Body: only allowed fields are updated (name, email, phone, student_id, campuses_id, campus_name, school_id, is_active, profile_image_url, bio, graduation_year, major). Rejects empty body and missing ID. Returns 404 if not found, 409 on duplicate email.
- Sample JSON:

```json
{
  "success": true,
  "message": "Ambassador updated successfully",
  "data": { "_id": "ambId", "email": "new@school.edu" },
  "updatedFields": ["email"]
}
```

5. Delete ambassador: `/api/admin/ambassadors/{id}` (DELETE)

- Implementation: [src/controllers/admin/ambassadors.controller.ts#L298](../../src/controllers/admin/ambassadors.controller.ts#L298)
- Data: validates ID presence/format, ensures record exists, then hard-deletes (`findByIdAndDelete`). Returns deleted id/name/email.
- Sample JSON:

```json
{
  "success": true,
  "message": "Ambassador deleted successfully",
  "data": { "deletedAmbassador": { "id": "ambId", "name": "Jane", "email": "jane@school.edu" } }
}
```

6. List ambassadors by campus: `/api/admin/ambassadors/campus/{campusId}` (GET)

- Implementation: [src/controllers/admin/ambassadors.controller.ts#L351](../../src/controllers/admin/ambassadors.controller.ts#L351)
- Data: finds ambassadors where `campuses_id` contains the campus. Returns `count` for convenience.
- Sample JSON:

```json
{ "success": true, "message": "Ambassadors retrieved successfully", "data": [{ "_id": "ambId" }], "count": 1 }
```

## Data reliability

- All endpoints hit real MongoDB collections via models: Ambassador and User. No caching or mock layers.
- ID validation: missing/invalid IDs return 400; not-found returns 404; duplicate email during create/update returns 409.
- Avatar/active enrichment is pulled live from User by matching ambassador email.
