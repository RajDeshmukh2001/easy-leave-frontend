# EasyLeave - Leave Management System (Frontend)

#### EasyLeave is a web application that streamlines the process of applying, managing, and tracking leaves within an organization.

#### It supports multiple user roles such as employees, managers, and administrators, enabling role-based access to features like leave application, leave tracking, approval workflows, and leave balance management, ensuring an organized and efficient leave management experience.

---

## Tech Stack

- Reactjs (v19+)
- TypeScript
- Tailwind CSS - Styling
- React Router v7 - Page navigation
- Formik - Form handling
- Yup - Form validation
- Vitest - Testing

## Features

### Apply Leave

### Overview

Allows employees to apply for leave from the Leave page by selecting a date range, choosing a leave category, and providing necessary details, ensuring a smooth and structured leave application process.

#### Key Highlights

- Select leave using date range picker (weekends disabled)
- Choose leave category via API integration
- Configure leave duration
- Form validation before submission
- Toast notifications for success/error feedback
- Auto-refresh leave list after successful submission

#### API Integration

- Fetch leave categories from backend

```
GET /api/leave-categories
```

- Submit leave request via:

```
POST /api/leaves/
```

#### How to Test

1. Go to Leave page
2. Make sure you are logged in with correct google account
3. Fill and submit leave form
4. Expect: Success toast + list refresh

---

### Update Leave

#### Overview

Allows users to update existing leaves from the Leave Details page.

Ensures only modified fields are sent to the backend, improving efficiency and reducing unnecessary updates.

### Key Highlights

- Update existing leave records
- Pre-filled form with existing leave data
- Sends only changed fields using optimized payload
- Prevents submission when no changes are made
- Displays success and error feedback via toast notifications

### API Integration

Endpoint used:

```
PATCH /api/leaves/{leaveId}
```

Uses `buildUpdatePayload` utility to:

- Compare old vs new values
- Send only modified fields

### How to Test

1. Go to Leave page
2. Click on any leave record
3. Verify form is pre-filled
4. Modify any field → click Update Leave
5. Expect: Success toast + redirect to `/leave`
6. No changes:
   - Click Update Leave without changes
   - Expect: Error toast (no API call)

---

### All Employees Leave Balance Page

#### Overview

This feature adds a new page for managers to view a list of all employees along with their leaves taken and leave balance for a selected year.

#### Key Highlights

- Manager can view all employees with their leave balance for a selected year
- Year filter dropdown to switch between years
- Paginated list with "Load More" button to fetch next page
- Shows loading state while fetching data
- Shows error message if API fails
- Shows empty state if no employees found

#### How to Use

1. Log in as a manager
2. Navigate to the All Employees Leave Balance page from the navigation menu
3. Select a year from the dropdown filter
4. View the list of employees with their leave taken and balance
5. Click "Load More" to fetch additional results

#### Error Handling

- Displays error message when API call fails
- Shows empty state when no employees found for selected year

#### Responsive Design

- Fully responsive across desktop, tablet, and mobile devices
- Navigation and filter dropdown adapts to screen size
- Table view converts to card view on mobile


## Features

## Manager Dashboard Page

The **Manager Dashboard** provides a centralised overview of all employees' leave activity, enabling managers to monitor employee availability.

---

### Features

- **Dashboard Metrics**
  - Total number of employees
  - Employees currently on leave (today)
  - Employees scheduled for leave (tomorrow)

- **Leave Insights**
  - **Currently on Leave**: Displays employees who are on leave today
  - **Upcoming Leaves**: Shows scheduled leaves for upcoming days

- **Real-time Data Fetching**
  - Automatically fetches and updates leave data based on:
    - Leave status (`ongoing`, `upcoming`)
    - Scope (`organization`)

- **Error & Loading Handling**
  - Loading indicators for API calls
  - Graceful error messages when data fetching fails

---

### Component Structure

#### 1. `ManagerDashboard`

Main container component responsible for:

- Fetching dashboard metrics
- Rendering metric cards
- Displaying leave lists

#### 2. `useLeaves` (Custom Hook)

Handles:

- Fetching leave data
- Managing loading and error states
- Providing a refresh mechanism

#### 3. DashboardMetricsCard

Displays key metrics such as:

- Total Employees
- On Leave Today
- On Leave Tomorrow

#### 4. LeaveCardItem

Reusable card component to display:

- Employee name
- Leave duration/date
- Leave type badge

---
