# Admin Settings Controller

English overview of `/api/admin/v2/settings/*` endpoints. All require admin auth. Data is read/written directly via the User model through `adminSettingsService`; no mocks or cache. Password changes rely on bcrypt and existing pre-save hashing.

## Endpoints and data sources

1. Update profile: `/api/admin/v2/settings/profile` (PUT)

- Implementation: [src/controllers/admin/settings.controller.ts#L15](../../src/controllers/admin/settings.controller.ts#L15), service [src/services/admin/settings.service.ts#L4](../../src/services/admin/settings.service.ts#L4).
- Body: `firstName`, `lastName`, `position` (all optional; trimmed). Only provided fields are updated.
- Data: updates User by `req.user.id`; returns updated name, position, email, avatar (fallback to ui-avatars).
- Sample JSON:

```json
{
  "id": "userId",
  "firstName": "Ana",
  "lastName": "Silva",
  "position": "Admin",
  "email": "ana@example.com",
  "avatar_url": "https://..."
}
```

2. Change password: `/api/admin/v2/settings/password` (PUT)

- Implementation: [src/controllers/admin/settings.controller.ts#L41](../../src/controllers/admin/settings.controller.ts#L41), service [src/services/admin/settings.service.ts#L27](../../src/services/admin/settings.service.ts#L27).
- Body: `currentPassword`, `newPassword` (required). Verifies current password with bcrypt; updates password and `password_changed_at`. Error codes: 400 missing, 401 incorrect current, 404 user not found/no password set, 500 otherwise.
- Data: reads user with `+password` and saves new password (hashed by pre-save hook).
- Sample JSON:

```json
{ "success": true, "message": "Password changed successfully" }
```

3. Logout all devices: `/api/admin/v2/settings/logout-all` (POST)

- Implementation: [src/controllers/admin/settings.controller.ts#L79](../../src/controllers/admin/settings.controller.ts#L79), service [src/services/admin/settings.service.ts#L55](../../src/services/admin/settings.service.ts#L55).
- Data: currently returns `{ success: true }` (placeholder; no session/token revocation implemented).
- Sample JSON:

```json
{ "success": true }
```

4. Request account deletion: `/api/admin/v2/settings/delete-account` (POST)

- Implementation: [src/controllers/admin/settings.controller.ts#L105](../../src/controllers/admin/settings.controller.ts#L105), service [src/services/admin/settings.service.ts#L59](../../src/services/admin/settings.service.ts#L59).
- Body: `reason` (optional string in controller typing). Currently returns `{ success: true, reason }`; no deletion workflow implemented.
- Sample JSON:

```json
{ "success": true, "reason": "No longer needed" }
```

## Data reliability and notes

- Uses the User collection via Mongoose. Password hashing depends on existing pre-save hooks (not shown here) when `user.save()` is called.
- Logout-all and delete-account are placeholders; no token/session invalidation or destructive deletion is executed in the current service implementation.
- Error handling in change-password maps specific messages to HTTP codes (400/401/404) before defaulting to 500; other endpoints return 500 on unexpected errors.
