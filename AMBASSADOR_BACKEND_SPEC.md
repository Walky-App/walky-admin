# Ambassador Management Backend Endpoints

This document outlines the backend API endpoints needed for the Ambassador Management system in the Walky Admin panel.

## Required Endpoints

### 1. Get All Ambassadors

- **Method**: `GET`
- **Endpoint**: `/api/ambassadors`
- **Description**: Retrieve all ambassadors
- **Response**: Array of ambassador objects

```json
{
  "data": [
    {
      "id": "string (UUID)",
      "name": "string",
      "email": "string",
      "phone": "string (optional)",
      "student_id": "string (optional)",
      "campus_id": "string (optional, FK to campuses)",
      "campus_name": "string (computed/joined field)",
      "is_active": "boolean",
      "profile_image_url": "string (optional)",
      "bio": "string (optional)",
      "graduation_year": "number (optional)",
      "major": "string (optional)",
      "created_at": "string (ISO timestamp)",
      "updated_at": "string (ISO timestamp)"
    }
  ]
}
```

### 2. Get Ambassador by ID

- **Method**: `GET`
- **Endpoint**: `/api/ambassadors/{id}`
- **Description**: Retrieve a specific ambassador by ID
- **Response**: Single ambassador object

```json
{
  "data": {
    "id": "string (UUID)",
    "name": "string",
    "email": "string",
    "phone": "string (optional)",
    "student_id": "string (optional)",
    "campus_id": "string (optional)",
    "campus_name": "string (computed/joined field)",
    "is_active": "boolean",
    "profile_image_url": "string (optional)",
    "bio": "string (optional)",
    "graduation_year": "number (optional)",
    "major": "string (optional)",
    "created_at": "string (ISO timestamp)",
    "updated_at": "string (ISO timestamp)"
  }
}
```

### 3. Create Ambassador

- **Method**: `POST`
- **Endpoint**: `/api/ambassadors`
- **Description**: Create a new ambassador
- **Request Body**:

```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "phone": "string (optional)",
  "student_id": "string (optional)",
  "campus_id": "string (optional, must exist in campuses table)",
  "is_active": "boolean (default: true)",
  "profile_image_url": "string (optional)",
  "bio": "string (optional)",
  "graduation_year": "number (optional)",
  "major": "string (optional)"
}
```

**Response**: Created ambassador object (same structure as GET)

### 4. Update Ambassador

- **Method**: `PUT`
- **Endpoint**: `/api/ambassadors/{id}`
- **Description**: Update an existing ambassador
- **Request Body**: Same as create, but all fields are optional

**Response**: Updated ambassador object

### 5. Delete Ambassador

- **Method**: `DELETE`
- **Endpoint**: `/api/ambassadors/{id}`
- **Description**: Delete an ambassador
- **Response**:

```json
{
  "message": "Ambassador deleted successfully"
}
```

### 6. Get Ambassadors by Campus (Optional but Recommended)

- **Method**: `GET`
- **Endpoint**: `/api/ambassadors/campus/{campus_id}`
- **Description**: Get all ambassadors assigned to a specific campus
- **Response**: Array of ambassador objects for that campus

## Database Schema Recommendations

### Ambassadors Table

```sql
CREATE TABLE ambassadors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  student_id VARCHAR(100),
  campus_id UUID REFERENCES campuses(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  profile_image_url TEXT,
  bio TEXT,
  graduation_year INTEGER,
  major VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_ambassadors_campus_id ON ambassadors(campus_id);
CREATE INDEX idx_ambassadors_email ON ambassadors(email);
CREATE INDEX idx_ambassadors_is_active ON ambassadors(is_active);
```

## Validation Rules

### Required Fields

- `name`: Must be provided and not empty
- `email`: Must be valid email format and unique

### Optional Constraints

- `email`: Must be unique across all ambassadors
- `campus_id`: If provided, must exist in the campuses table
- `graduation_year`: If provided, should be reasonable (e.g., 2020-2030)
- `profile_image_url`: If provided, should be a valid URL

## Error Responses

### Validation Errors (400)

```json
{
  "error": "Validation failed",
  "errors": {
    "email": "Email is required",
    "name": "Name is required"
  }
}
```

### Not Found (404)

```json
{
  "error": "Ambassador not found"
}
```

### Conflict (409) - Duplicate Email

```json
{
  "error": "Ambassador with this email already exists"
}
```

## Integration Notes

1. **Campus Integration**: When displaying ambassadors, join with the campuses table to show campus names
2. **Soft Delete**: Consider implementing soft delete instead of hard delete to maintain data integrity
3. **Image Handling**: The profile_image_url can be a direct URL or you can implement file upload endpoints
4. **Search/Filter**: Consider adding query parameters for filtering by campus, status, or searching by name/email
5. **Pagination**: For large datasets, implement pagination with limit/offset or cursor-based pagination

## Frontend Implementation Status

✅ **Completed**:

- Ambassador types and interfaces
- Ambassador service with all CRUD operations
- Ambassadors list page with table view
- Ambassador details/form page for create/edit
- React Query integration for data management
- Error handling and validation
- Success/error messaging
- Loading states and skeletons

The frontend is ready and will work as soon as you implement the backend endpoints following this specification.
