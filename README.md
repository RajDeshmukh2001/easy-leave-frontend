# EasyLeave - Leave Management System (Frontend)

---

## Tech Stack

- Reactjs (v19+)
- TypeScript
- Tailwind CSS - Styling
- React Router v7 - Page navigation
- Formik - Form handling
- Yup - Form validation
- Vitest - Testing

# All Employees Leave Balance Page

## Overview

This feature adds a new page for managers to view a list of all employees along with their leaves taken and leave balance for a selected year.

## Features

- Manager can view all employees with their leave balance for a selected year
- Year filter dropdown to switch between years
- Paginated list with "Load More" button to fetch next page
- Shows loading state while fetching data
- Shows error message if API fails
- Shows empty state if no employees found

## How to Use

1. Log in as a manager
2. Navigate to the All Employees Leave Balance page from the navigation menu
3. Select a year from the dropdown filter
4. View the list of employees with their leave taken and balance
5. Click "Load More" to fetch additional results

## Error Handling

- Displays error message when API call fails
- Shows empty state when no employees found for selected year

## Responsive Design

- Fully responsive across desktop, tablet, and mobile devices
- Navigation and filter dropdown adapts to screen size
- Table view converts to card view on mobile
