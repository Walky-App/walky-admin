# Google Places API Fields to Sync

## Required Fields for Backend Sync Implementation

When syncing places from Google Places API, the backend should request and store these additional fields:

### 1. Place Details Fields to Request

```javascript
const fieldsToRequest = [
  // Basic fields (already implemented)
  'place_id',
  'name',
  'formatted_address',
  'formatted_phone_number',
  'international_phone_number',
  'website',
  'rating',
  'user_ratings_total',
  'price_level',
  'types',
  'geometry',
  'photos',
  'opening_hours',
  
  // New fields to add
  'editorial_summary',        // Contains description/overview
  'business_status',          // OPERATIONAL, CLOSED_TEMPORARILY, CLOSED_PERMANENTLY
  'curbside_pickup',         // boolean
  'delivery',                // boolean
  'dine_in',                 // boolean
  'takeout',                 // boolean
  'reservable',              // boolean
  'serves_beer',             // boolean
  'serves_breakfast',        // boolean
  'serves_brunch',           // boolean
  'serves_dinner',           // boolean
  'serves_lunch',            // boolean
  'serves_vegetarian_food',  // boolean
  'serves_wine',             // boolean
  'wheelchair_accessible_entrance', // boolean
  'url',                     // Google Maps URL
  'vicinity',                // Simplified address
  'plus_code',               // Location plus codes
  'icon',                    // Place category icon
  'icon_background_color',   // Icon styling
  'icon_mask_base_uri'       // Icon mask for custom styling
].join(',');
```

### 2. Data Mapping

When storing the place data, map these fields:

```javascript
const placeData = {
  // Existing fields...
  
  // Add new fields
  editorial_summary: googlePlaceData.editorial_summary,
  business_status: googlePlaceData.business_status,
  
  // Service booleans
  curbside_pickup: googlePlaceData.curbside_pickup,
  delivery: googlePlaceData.delivery,
  dine_in: googlePlaceData.dine_in,
  takeout: googlePlaceData.takeout,
  reservable: googlePlaceData.reservable,
  
  // Food service times
  serves_beer: googlePlaceData.serves_beer,
  serves_breakfast: googlePlaceData.serves_breakfast,
  serves_brunch: googlePlaceData.serves_brunch,
  serves_dinner: googlePlaceData.serves_dinner,
  serves_lunch: googlePlaceData.serves_lunch,
  serves_vegetarian_food: googlePlaceData.serves_vegetarian_food,
  serves_wine: googlePlaceData.serves_wine,
  
  // Accessibility
  wheelchair_accessible_entrance: googlePlaceData.wheelchair_accessible_entrance,
  
  // Additional location data
  url: googlePlaceData.url,
  vicinity: googlePlaceData.vicinity,
  plus_code: googlePlaceData.plus_code,
  
  // Visual elements
  icon: googlePlaceData.icon,
  icon_background_color: googlePlaceData.icon_background_color,
  icon_mask_base_uri: googlePlaceData.icon_mask_base_uri,
  
  // Also store coordinates in the expected format
  coordinates: googlePlaceData.geometry?.location ? {
    lat: googlePlaceData.geometry.location.lat,
    lng: googlePlaceData.geometry.location.lng
  } : undefined,
  
  // Store opening hours in both fields for compatibility
  hours: googlePlaceData.opening_hours
};
```

### 3. Google Places API Request Example

```javascript
const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fieldsToRequest}&key=${API_KEY}`;
```

### 4. Database Schema Updates

Ensure the MongoDB schema includes all these new fields with appropriate types:

```javascript
{
  // Service fields
  curbside_pickup: { type: Boolean },
  delivery: { type: Boolean },
  dine_in: { type: Boolean },
  takeout: { type: Boolean },
  reservable: { type: Boolean },
  
  // Food service fields
  serves_beer: { type: Boolean },
  serves_breakfast: { type: Boolean },
  serves_brunch: { type: Boolean },
  serves_dinner: { type: Boolean },
  serves_lunch: { type: Boolean },
  serves_vegetarian_food: { type: Boolean },
  serves_wine: { type: Boolean },
  
  // Other fields
  editorial_summary: {
    language: String,
    overview: String
  },
  business_status: String,
  wheelchair_accessible_entrance: { type: Boolean },
  url: String,
  vicinity: String,
  plus_code: {
    compound_code: String,
    global_code: String
  },
  icon: String,
  icon_background_color: String,
  icon_mask_base_uri: String
}
```

## Benefits of These Additional Fields

1. **Description** (`editorial_summary.overview`) - Provides context about what the place is
2. **Business Status** - Know if a place is still operational
3. **Service Information** - Users can filter by delivery, takeout, etc.
4. **Accessibility** - Important for inclusive campus navigation
5. **Food Service Times** - Helpful for students looking for meals at specific times
6. **Google Maps URL** - Direct link for more information

## API Cost Considerations

Note that requesting additional fields may increase API costs. Consider:
- Only requesting fields that will be actively used
- Implementing field-level updates to avoid re-fetching all data
- Caching data appropriately