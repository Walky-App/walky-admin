# Admin Areas of Study Controller

English overview of `/api/admin/areas-of-study*` endpoints. Data is read/written directly in MongoDB via the `AreaOfStudy` model (Mongoose). No caching or mocks.

## Endpoints and data sources

1. List areas (with pagination/search): likely `/api/admin/areas-of-study` (GET)

- Implementation: [src/controllers/admin/areasOfStudy.controller.ts#L9](../../src/controllers/admin/areasOfStudy.controller.ts#L9)
- Query params: `page` (default 1), `limit` (default 50), `search` (by name, case-insensitive; if it is a valid ObjectId, also matches `_id`), `activeOnly` ("true" to filter `isActive=true`).
- Data: `AreaOfStudy.find` with optional regex/ID filter; returns pagination metadata.
- Sample JSON:

```json
{
  "areas": [{ "_id": "id1", "name": "Computer Science", "isActive": true }],
  "pagination": { "page": 1, "limit": 50, "total": 120, "totalPages": 3 }
}
```

2. Get by ID: `/api/admin/areas-of-study/{id}` (GET)

- Implementation: [src/controllers/admin/areasOfStudy.controller.ts#L41](../../src/controllers/admin/areasOfStudy.controller.ts#L41)
- Data: finds by `_id`; returns 404 if not found.
- Sample JSON:

```json
{ "_id": "id1", "name": "Computer Science", "isActive": true }
```

3. Create: `/api/admin/areas-of-study` (POST)

- Implementation: [src/controllers/admin/areasOfStudy.controller.ts#L59](../../src/controllers/admin/areasOfStudy.controller.ts#L59)
- Body: `name` (required, trimmed). Rejects empty; 409 if name already exists.
- Data: inserts new AreaOfStudy with `isActive=true`.
- Sample JSON:

```json
{ "message": "Area of study created successfully", "area": { "_id": "newId", "name": "Biology", "isActive": true } }
```

4. Update: `/api/admin/areas-of-study/{id}` (PUT/PATCH)

- Implementation: [src/controllers/admin/areasOfStudy.controller.ts#L86](../../src/controllers/admin/areasOfStudy.controller.ts#L86)
- Body: `name` (optional, must be unique) and/or `isActive` (boolean). 404 if not found; 409 if new name already exists.
- Data: updates fields, saves document.
- Sample JSON:

```json
{ "message": "Area of study updated successfully", "area": { "_id": "id1", "name": "CompSci", "isActive": true } }
```

5. Delete (soft or hard): `/api/admin/areas-of-study/{id}` (DELETE)

- Implementation: [src/controllers/admin/areasOfStudy.controller.ts#L122](../../src/controllers/admin/areasOfStudy.controller.ts#L122)
- Query: `permanent=true` for hard delete; otherwise soft delete sets `isActive=false`.
- Data: 404 if not found; hard delete removes doc; soft delete keeps doc inactive.
- Sample JSON (soft):

```json
{ "message": "Area of study deactivated", "area": { "_id": "id1", "isActive": false } }
```

- Sample JSON (hard):

```json
{ "message": "Area of study permanently deleted" }
```

6. Search: `/api/admin/areas-of-study/search?q=...` (GET)

- Implementation: [src/controllers/admin/areasOfStudy.controller.ts#L157](../../src/controllers/admin/areasOfStudy.controller.ts#L157)
- Query: `q` (required), `limit` (default 20).
- Data: uses `AreaOfStudy.searchByName` helper (regex search) with limit; returns matches and count.
- Sample JSON:

```json
{ "areas": [{ "_id": "id1", "name": "Math" }], "count": 1 }
```

7. Bulk create: `/api/admin/areas-of-study/bulk` (POST)

- Implementation: [src/controllers/admin/areasOfStudy.controller.ts#L176](../../src/controllers/admin/areasOfStudy.controller.ts#L176)
- Body: `names` (array, required).
- Data: iterates names; trims; skips existing; collects `created`, `skipped`, `errors`. Creates new areas with `isActive=true`.
- Sample JSON:

```json
{
  "message": "Bulk creation completed",
  "results": {
    "created": ["Biology"],
    "skipped": ["Math"],
    "errors": ["Empty name"]
  }
}
```

## Data reliability

- All endpoints use the `AreaOfStudy` MongoDB collection via Mongoose. No caching or mock layers.
- Soft delete is implemented by `isActive=false`; hard delete removes the document when `permanent=true`.
- Search supports both name regex and direct ObjectId match when the query looks like an ObjectId.
