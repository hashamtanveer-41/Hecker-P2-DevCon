# Dashboard API Integration

## Overview
The Dashboard page now calls real APIs to fetch hospital statistics instead of using hardcoded mock data.

## APIs Being Called

### 1. **Operating Rooms API** (`orAPI.getAll()`)
- **Purpose**: Fetch all operating rooms for the hospital
- **Data Used**: Number of operating rooms
- **Stat Updated**: `totalORs`
- **File**: `src/api/or.api.js`

```javascript
const orsResponse = await orAPI.getAll();
const ors = Array.isArray(orsResponse) ? orsResponse : orsResponse.data || [];
setStats({ totalORs: ors.length })
```

### 2. **Staff API** (`staffAPI.getAll()`)
- **Purpose**: Fetch all staff members for the hospital
- **Data Used**: Count of active staff
- **Stat Updated**: `activeStaff`
- **File**: `src/api/staff.api.js`

```javascript
const staffResponse = await staffAPI.getAll();
const staffMembers = Array.isArray(staffResponse) ? staffResponse : staffResponse.data || [];
setStats({ activeStaff: staffMembers.length })
```

### 3. **Surgery Requests API** (`surgeryAPI.getAll()`)
- **Purpose**: Fetch all surgery requests
- **Data Used**: Number of pending surgery requests
- **Stat Updated**: `pendingRequests`
- **File**: `src/api/surgery.api.js`

```javascript
const surgeryResponse = await surgeryAPI.getAll();
const surgeries = Array.isArray(surgeryResponse) ? surgeryResponse : surgeryResponse.data || [];
const pendingRequests = surgeries.filter(s => s.status === 'PENDING').length;
setStats({ pendingRequests })
```

### 4. **Scheduler API** (`schedulerAPI.getCalendarDay()`)
- **Purpose**: Fetch today's scheduled surgeries
- **Data Used**: Number of surgeries scheduled for today
- **Stat Updated**: `scheduledToday`
- **File**: `src/api/scheduler.api.js`

```javascript
const today = new Date().toISOString().split('T')[0];
const scheduledResponse = await schedulerAPI.getCalendarDay(today);
const scheduledToday = scheduledResponse.schedules ? scheduledResponse.schedules.length : 0;
setStats({ scheduledToday })
```

---

## State Management

### Stats Object
```javascript
{
    totalORs: number,           // Number of operating rooms
    activeStaff: number,        // Number of staff members
    pendingRequests: number,    // Count of pending surgery requests
    scheduledToday: number      // Count of surgeries scheduled today
}
```

### Loading & Error States
```javascript
const [loading, setLoading] = useState(true);      // Loading indicator
const [error, setError] = useState(null);          // Error message display
```

---

## Features

### ✅ Loading State
- Shows "Loading dashboard statistics..." message while fetching data
- Prevents UI from updating until data is ready

### ✅ Error Handling
- Catches errors during API calls
- Displays error message to user
- Falls back to mock data if API calls fail
- Logs errors to console for debugging

### ✅ Data Dependency
- Fetches data whenever `hospitalId` changes
- Automatically refetches when hospital is switched
- Handles missing hospitalId gracefully

### ✅ Responsive Data
- Filters pending requests (status === 'PENDING')
- Gets today's date dynamically
- Handles array and object response formats

---

## Backend Requirements

### Expected API Response Format

#### Operating Rooms
```javascript
// GET /operating-rooms
[
    { id: 1, name: "OR-1", capabilities: [...], status: "available" },
    ...
]
```

#### Staff
```javascript
// GET /staff
[
    { id: 1, name: "Dr. John", role: "SURGEON", is_available: true },
    ...
]
```

#### Surgery Requests
```javascript
// GET /surgery-requests
[
    { id: 1, patient: "...", status: "PENDING", ... },
    { id: 2, patient: "...", status: "APPROVED", ... },
    ...
]
```

#### Calendar (Today's Schedule)
```javascript
// GET /calendar/day?date=2024-02-10
{
    schedules: [
        { id: 1, surgery_id: 1, operating_room_id: 1, start_time: "...", end_time: "..." },
        ...
    ]
}
```

---

## Error Fallback

If any API call fails, the dashboard will:
1. Log the error to console
2. Display error message: "Failed to load dashboard statistics"
3. Show mock data so the dashboard remains functional:
   - totalORs: 12
   - activeStaff: 45
   - pendingRequests: 8
   - scheduledToday: 15

---

## How to Switch Between Mock & Real APIs

### Using Mock Data (Current when APIs fail)
The `mockData.js` file contains sample data that is used by the APIs when `USE_MOCK_DATA = true`

### Using Real Backend APIs
Uncomment the API calls in the fetch function and ensure your backend is running at `http://localhost:8000`

---

## Component Props
- **hospitalName**: From HospitalContext - displays hospital name in header
- **hospitalId**: From HospitalContext - used as dependency for fetching data

---

## Example Usage Flow

```
1. User navigates to Dashboard
2. useEffect triggers with [hospitalId] dependency
3. Loading state = true → Shows "Loading..." message
4. API calls:
   - orAPI.getAll() → Get ORs count
   - staffAPI.getAll() → Get staff count
   - surgeryAPI.getAll() → Get pending requests count
   - schedulerAPI.getCalendarDay(today) → Get today's schedule count
5. Stats state updated with new values
6. Loading state = false → Shows stats cards
7. Stats cards re-render with new data
```

---

## Files Modified
- `src/pages/Dashboard.jsx` - Added API integration

## Files Used
- `src/api/or.api.js`
- `src/api/staff.api.js`
- `src/api/surgery.api.js`
- `src/api/scheduler.api.js`
- `src/context/HospitalContext.jsx`

