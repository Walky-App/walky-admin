# Backend Swagger Documentation Checklist

## 1. Main Swagger Configuration
Check your main app file (app.js/app.ts or server.js/server.ts):

```typescript
// Correct Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Walky API',
      version: '1.0.0',
      description: 'Campus navigation and place management API',
      contact: {
        name: 'Walky Support',
        email: 'support@walky.app'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      },
      {
        url: 'https://api.walky.app',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/models/*.ts']
};
```

## 2. Controller Documentation Checklist

### ✅ Places Controller
Check each endpoint has:

```typescript
/**
 * @swagger
 * /api/places:
 *   get:
 *     summary: Get all places
 *     description: Retrieve a paginated list of places with optional filters
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: campus_id
 *         schema:
 *           type: string
 *         description: Filter by campus ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in place names and addresses
 *       - in: query
 *         name: categories
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         description: Filter by category IDs
 *       - in: query
 *         name: google_types
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by Google place types
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 places:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Place'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
```

### ✅ Authentication Controller
```typescript
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user and receive JWT token
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *       422:
 *         description: Validation error
 */
```

## 3. Model/Schema Documentation

### ✅ Place Schema
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     Place:
 *       type: object
 *       required:
 *         - place_id
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ID
 *         place_id:
 *           type: string
 *           description: Google Places ID
 *         name:
 *           type: string
 *           description: Place name
 *         address:
 *           type: string
 *           description: Short address
 *         formatted_address:
 *           type: string
 *           description: Full formatted address
 *         opening_hours:
 *           type: object
 *           properties:
 *             weekday_text:
 *               type: array
 *               items:
 *                 type: string
 *             periods:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   open:
 *                     type: object
 *                     properties:
 *                       day:
 *                         type: integer
 *                       time:
 *                         type: string
 *                   close:
 *                     type: object
 *                     properties:
 *                       day:
 *                         type: integer
 *                       time:
 *                         type: string
 *         coordinates:
 *           type: object
 *           properties:
 *             lat:
 *               type: number
 *             lng:
 *               type: number
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         photos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Photo'
 *         campus_id:
 *           type: string
 *         categories:
 *           type: array
 *           items:
 *             type: string
 */
```

## 4. Common Issues to Check

### ❌ Incorrect
```typescript
// Missing description, parameters, responses
/**
 * @swagger
 * /api/places/{id}:
 *   get:
 *     summary: Get place
 */
```

### ✅ Correct
```typescript
/**
 * @swagger
 * /api/places/{id}:
 *   get:
 *     summary: Get place by ID
 *     description: Retrieve detailed information about a specific place
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Place ID (MongoDB _id or Google place_id)
 *     responses:
 *       200:
 *         description: Place found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Place'
 *       404:
 *         description: Place not found
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
```

## 5. Validation Checklist

### For Each Endpoint:
- [ ] Has summary (short description)
- [ ] Has description (detailed explanation)
- [ ] Has appropriate tags
- [ ] Security requirements specified (or explicitly none)
- [ ] All parameters documented with:
  - [ ] Name
  - [ ] Location (query, path, header, body)
  - [ ] Type
  - [ ] Required/optional
  - [ ] Description
  - [ ] Default values (if any)
  - [ ] Constraints (min, max, enum, pattern)
- [ ] Request body schema (for POST/PUT/PATCH)
- [ ] All possible response codes documented
- [ ] Response schemas for each status code
- [ ] Examples provided where helpful

### For Schemas:
- [ ] All properties have types
- [ ] Required fields marked
- [ ] Descriptions for complex fields
- [ ] Enums documented with allowed values
- [ ] Nested objects properly defined
- [ ] Arrays specify item types
- [ ] Format specified for special types (email, date, uuid)

### General:
- [ ] Consistent naming (camelCase vs snake_case)
- [ ] No typos in descriptions
- [ ] Security scheme properly configured
- [ ] Base URL and servers configured
- [ ] API version specified
- [ ] Contact information provided

## 6. Testing Your Swagger

1. **Access Swagger UI**: Navigate to `/api-docs` or `/swagger`
2. **Try each endpoint**: Click "Try it out" to test
3. **Check authorization**: Ensure protected routes require auth
4. **Validate responses**: Match actual responses with documentation
5. **Check for errors**: Look for parsing errors in console

## 7. Common Attributes to Verify

### Query Parameters:
- `page` - should be integer, min: 1
- `limit` - should be integer, min: 1, max: 100
- `search` - should be string, allow empty
- `sort` - should document allowed values
- `order` - should be enum: ['asc', 'desc']

### Response Headers:
```yaml
X-Total-Count:
  description: Total number of items
  schema:
    type: integer
X-Page-Count:
  description: Total number of pages
  schema:
    type: integer
```

### Error Responses:
```typescript
/**
 * @swagger
 * components:
 *   responses:
 *     BadRequest:
 *       description: Bad request
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *               message:
 *                 type: string
 *               details:
 *                 type: array
 *                 items:
 *                   type: object
 *     Unauthorized:
 *       description: Unauthorized
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Unauthorized
 *               message:
 *                 type: string
 *                 example: Invalid or missing authentication token
 */
```

## 8. Validate with Tools

Use these commands in your backend:
```bash
# Install swagger validator
npm install -g swagger-cli

# Validate your swagger
swagger-cli validate ./swagger.json

# Or if using OpenAPI 3.0
npx @apidevtools/openapi-cli validate ./openapi.json
```