# Mixpanel Event Tracking Documentation

## Navigation Components

### Sidebar V2

**Component**: `SidebarV2`

**Events being tracked:**

#### 1. Sidebar - Menu Item Clicked

Triggered when user clicks a main menu item without submenu.

**Properties:**

- `label`: Label of the menu item clicked
- `path`: Path the user is navigating to
- `timestamp`: Event timestamp

#### 2. Sidebar - Menu Toggled

Triggered when user expands or collapses a menu section with submenu.

**Properties:**

- `label`: Label of the menu section
- `action`: Either `expanded` or `collapsed`
- `timestamp`: Event timestamp

**Menu Sections:**

- Campus Analytics
- Manage Students
- Events
- Spaces
- Ideas

#### 3. Sidebar - Submenu Item Clicked

Triggered when user clicks a submenu item.

**Properties:**

- `label`: Label of the submenu item
- `path`: Path the user is navigating to
- `timestamp`: Event timestamp

**Available Submenu Items:**

- Dashboard: Engagement, Popular Features, User Interactions, Community, Student safety, Student Behavior
- Manage Students: Active, Banned, Deactivated, Disengaged
- Events: Events Manager, Events Insights
- Spaces: Spaces Manager, Spaces Insights
- Ideas: Ideas Manager, Ideas Insights

---

### Topbar V2

**Component**: `TopbarV2`

**Events being tracked:**

#### 1. Topbar - Hamburger Menu Clicked

Triggered when user clicks the hamburger menu icon to toggle sidebar.

**Properties:**

- `timestamp`: Event timestamp

#### 2. Topbar - School Selector Opened (Mobile)

Triggered when user opens the school selector on mobile.

**Properties:**

- `timestamp`: Event timestamp

#### 3. Topbar - Campus Selector Opened (Mobile)

Triggered when user opens the campus selector on mobile.

**Properties:**

- `timestamp`: Event timestamp

#### 4. Topbar - School Selected

Triggered when user selects a school from the dropdown (desktop).

**Properties:**

- `schoolId`: ID of the selected school
- `schoolName`: Name of the selected school
- `timestamp`: Event timestamp

#### 5. Topbar - Campus Selected

Triggered when user selects a campus from the dropdown (desktop).

**Properties:**

- `campusId`: ID of the selected campus
- `campusName`: Name of the selected campus
- `timestamp`: Event timestamp

#### 6. Topbar - School Selected (Mobile)

Triggered when user selects a school from the modal (mobile).

**Properties:**

- `schoolId`: ID of the selected school
- `schoolName`: Name of the selected school
- `timestamp`: Event timestamp

#### 7. Topbar - Campus Selected (Mobile)

Triggered when user selects a campus from the modal (mobile).

**Properties:**

- `campusId`: ID of the selected campus
- `campusName`: Name of the selected campus
- `timestamp`: Event timestamp

#### 8. Topbar - Theme Toggled

Triggered when user clicks the theme toggle button.

**Properties:**

- `newTheme`: Theme being switched to (`light` or `dark`)
- `timestamp`: Event timestamp

#### 9. Topbar - Administrator Settings Clicked

Triggered when user clicks "Administrator settings" from user dropdown.

**Properties:**

- `timestamp`: Event timestamp

#### 10. Topbar - Logout Clicked

Triggered when user clicks "Logout" from user dropdown.

**Properties:**

- `timestamp`: Event timestamp

#### 11. Topbar - School Selector Modal Closed (Mobile)

Triggered when user closes the school selector modal on mobile.

**Properties:**

- `timestamp`: Event timestamp

#### 12. Topbar - Campus Selector Modal Closed (Mobile)

Triggered when user closes the campus selector modal on mobile.

**Properties:**

- `timestamp`: Event timestamp

---

## Engagement Dashboard

**URL**: `https://admin.walky.app/v2/dashboard/engagement`

**Events being tracked:**

### 1. Engagement - Filter Time Period Changed

Triggered when user changes the time period filter (week/month/all-time).

**Properties:**

- `previous_value`: Previous time period selected
- `new_value`: New time period selected
- `timestamp`: Event timestamp

---

### 2. Engagement - Metric View Changed

Triggered when user switches between "User engagement over time" and "New users & retention" metrics.

**Properties:**

- `metric_type`: Selected metric type (`user-engagement` or `new-retention`)
- `previous_metric`: Previously selected metric
- `timestamp`: Event timestamp

---

### 3. Engagement - Data Exported

Triggered when user clicks the export button.

**Properties:**

- `time_period`: Current time period filter
- `selected_metric`: Current metric being viewed
- `timestamp`: Event timestamp

---

### 4. Footer - Suggest Data Link Clicked

Triggered when user clicks "Suggest here" link in the footer.

**Properties:**

- `location`: Where the suggest link was clicked from (`footer`)
- `timestamp`: Event timestamp

---

## Popular Features Dashboard

**URL**: `https://admin.walky.app/v2/dashboard/popular-features`

**Events being tracked:**

### 1. Popular Features - Filter Time Period Changed

Triggered when user changes the time period filter.

**Properties:**

- `previous_value`: Previous time period selected
- `new_value`: New time period selected
- `timestamp`: Event timestamp

---

### 2. Popular Features - Filter Popularity Changed

Triggered when user toggles between "Most popular" and "Least popular".

**Properties:**

- `previous_value`: Previous popularity filter (`most` or `least`)
- `new_value`: New popularity filter (`most` or `least`)
- `timestamp`: Event timestamp

---

### 3. Popular Features - View Type Toggle

Triggered when user toggles between Grid and List view.

**Properties:**

- `previous_value`: Previous view type (`grid` or `list`)
- `new_value`: New view type (`grid` or `list`)
- `timestamp`: Event timestamp

---

### 4. Popular Features - Data Exported

Triggered when user clicks the export button.

**Properties:**

- `time_period`: Current time period filter
- `popularity`: Current popularity filter
- `view_type`: Current view type
- `timestamp`: Event timestamp

---

### 5. Popular Features - See All Button Clicked

Triggered when user clicks "See all" on any feature card.

**Properties:**

- `category`: Category name (e.g., "Top interests", "Popular ways to connect", "Visited places", "Top invitation categories", "Most Engaged")
- `view_type`: Current view type when clicked
- `timestamp`: Event timestamp

---

### 6. Popular Features - Interests Modal Closed

Triggered when user closes the interests modal.

**Properties:**

- `category`: Category that was being viewed in the modal
- `timestamp`: Event timestamp

---

### 7. Popular Features - Modal Search Input

Triggered when user types in the search field inside the interests modal.

**Properties:**

- `search_query`: Search term entered by user
- `results_count`: Number of results found
- `modal_title`: Title of the modal (e.g., "Top interests")
- `timestamp`: Event timestamp

---

## User Interactions Dashboard

**URL**: `https://admin.walky.app/v2/dashboard/user-interactions`

**Events being tracked:**

### 1. User Interactions - Filter Time Period Changed

Triggered when user changes the time period filter (week/month/all-time).

**Properties:**

- `time_period`: New time period selected
- `previous_period`: Previous time period selected
- `timestamp`: Event timestamp

---

### 2. User Interactions - Data Exported

Triggered when user clicks the export button.

**Properties:**

- `time_period`: Current time period filter
- `timestamp`: Event timestamp

---

## Community Dashboard

**URL**: `https://admin.walky.app/v2/dashboard/community`

**Events being tracked:**

### 1. Community - Filter Time Period Changed

Triggered when user changes the time period filter (week/month/all-time).

**Properties:**

- `time_period`: New time period selected
- `previous_period`: Previous time period selected
- `timestamp`: Event timestamp

---

### 2. Community - Data Exported

Triggered when user clicks the export button.

**Properties:**

- `time_period`: Current time period filter
- `timestamp`: Event timestamp

---

## Student Behavior Dashboard

**URL**: `https://admin.walky.app/v2/dashboard/student-behavior`

**Events being tracked:**

### 1. Student Behavior - Filter Time Period Changed

Triggered when user changes the time period filter (week/month/all-time).

**Properties:**

- `time_period`: New time period selected
- `previous_period`: Previous time period selected
- `timestamp`: Event timestamp

---

### 2. Student Behavior - Data Exported

Triggered when user clicks the export button.

**Properties:**

- `time_period`: Current time period filter
- `timestamp`: Event timestamp

---

## Student Safety Dashboard

**URL**: `https://admin.walky.app/v2/dashboard/student-safety`

**Events being tracked:**

### 1. Student Safety - Filter Time Period Changed

Triggered when user changes the time period filter (week/month/all-time).

**Properties:**

- `time_period`: New time period selected
- `previous_period`: Previous time period selected
- `timestamp`: Event timestamp

---

### 2. Student Safety - Data Exported

Triggered when user clicks the export button.

**Properties:**

- `time_period`: Current time period filter
- `timestamp`: Event timestamp

---

### 3. Student Safety - Report History Modal Opened

Triggered when user clicks on a bar in the reports chart to view report details.

**Properties:**

- `report_type`: Type of report clicked (e.g., "People", "Events", "Spaces", "Ideas", "Messages")
- `time_period`: Current time period filter
- `timestamp`: Event timestamp

---

### 4. Student Safety - Report History Modal Closed

Triggered when user closes the report details modal.

**Properties:**

- `report_type`: Type of report that was being viewed
- `time_period`: Current time period filter
- `timestamp`: Event timestamp

---

## Manage Students - Active

**URL**: `https://admin.walky.app/v2/manage-students/active`

**Events being tracked:**

### 1. Active Students - Search Input

Triggered when user types in the search field.

**Properties:**

- `search_query`: Search term entered by user
- `timestamp`: Event timestamp

### 2. Active Students - Data Exported

Triggered when user clicks the export button.

**Properties:**

- `total_students`: Number of students being exported
- `timestamp`: Event timestamp

### 3. Active Students - View Profile Action

Triggered when user clicks "View profile" in the actions dropdown.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `student_status`: Status of the student
- `timestamp`: Event timestamp

### 4. Active Students - Send Email Action

Triggered when user clicks "Send email" in the actions dropdown.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `student_email`: Email of the student
- `timestamp`: Event timestamp

### 5. Active Students - Flag User Action

Triggered when user clicks "Flag" in the actions dropdown.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `already_flagged`: Whether the user was already flagged
- `timestamp`: Event timestamp

### 6. Active Students - Ban User Action

Triggered when user clicks "Ban user" in the actions dropdown.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

### 7. Active Students - Deactivate User Action

Triggered when user clicks "Deactivate user" in the actions dropdown.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 8. Active Students - Flag User Confirmed

Triggered when user confirms flagging a user in the modal.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 9. Active Students - Flag User Modal Closed

Triggered when user closes the flag user modal without confirming.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 10. Active Students - Ban User Confirmed

Triggered when user confirms banning a user in the modal.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `duration`: Ban duration selected
- `reason`: Ban reason provided
- `resolve_reports`: Whether to resolve reports
- `timestamp`: Event timestamp

---

### 11. Active Students - Ban User Modal Closed

Triggered when user closes the ban user modal without confirming.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 12. Active Students - Deactivate User Confirmed

Triggered when user confirms deactivating a user in the modal.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 13. Active Students - Deactivate User Modal Closed

Triggered when user closes the deactivate user modal without confirming.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 14. Active Students - Table Sorted

Triggered when user sorts the table by clicking on column headers.

**Properties:**

- `sort_field`: Column being sorted (e.g., "userId", "name", "memberSince")
- `sort_direction`: Direction of sort ("asc" or "desc")
- `previous_field`: Previous sort field
- `timestamp`: Event timestamp

---

### 15. Active Students - Page Changed

Triggered when user changes page in pagination.

**Properties:**

- `previous_page`: Previous page number
- `new_page`: New page number
- `total_pages`: Total number of pages
- `total_entries`: Total number of entries
- `timestamp`: Event timestamp

---

### 16. Active Students - Profile Email Copied

Triggered when user copies email in the profile modal.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 17. Active Students - Profile User ID Copied

Triggered when user copies user ID in the profile modal.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 18. Active Students - Profile Report ID Copied

Triggered when user copies report ID in the profile modal.

**Properties:**

- `report_id`: The report ID that was copied
- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 19. Active Students - Profile Tab Changed

Triggered when user switches tabs in the profile modal.

**Properties:**

- `tab`: New tab selected ("ban", "report", or "block")
- `previous_tab`: Previous tab
- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

## Manage Students - Banned

**URL**: `https://admin.walky.app/v2/manage-students/banned`

**Events being tracked:**

### 1. Banned Students - Search Input

Triggered when user types in the search field.

**Properties:**

- `search_query`: Search term entered
- `timestamp`: Event timestamp

### 2. Banned Students - Data Exported

Triggered when user clicks the export button.

**Properties:**

- `total_students`: Number of students being exported
- `timestamp`: Event timestamp

### 3. Banned Students - View Profile Action

Triggered when user clicks "View profile" in the actions dropdown.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `student_status`: Status of the student
- `timestamp`: Event timestamp

### 4. Banned Students - Send Email Action

Triggered when user clicks "Send email" in the actions dropdown.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `student_email`: Email of the student
- `timestamp`: Event timestamp

### 5. Banned Students - Flag User Action

Triggered when user clicks "Flag" in the actions dropdown.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `already_flagged`: Whether the user was already flagged
- `timestamp`: Event timestamp

### 6. Banned Students - Unban User Action

Triggered when user clicks "Unban user" in the actions dropdown.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

### 7. Banned Students - Deactivate User Action

Triggered when user clicks "Deactivate user" in the actions dropdown.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 8. Banned Students - Flag User Confirmed

Triggered when user confirms flagging a user in the modal.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 9. Banned Students - Flag User Modal Closed

Triggered when user closes the flag user modal without confirming.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 10. Banned Students - Unban User Confirmed

Triggered when user confirms unbanning a user in the modal.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 11. Banned Students - Unban User Modal Closed

Triggered when user closes the unban user modal without confirming.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 12. Banned Students - Deactivate User Confirmed

Triggered when user confirms deactivating a user in the modal.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 13. Banned Students - Deactivate User Modal Closed

Triggered when user closes the deactivate user modal without confirming.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 14. Banned Students - Table Sorted

Triggered when user sorts the table by clicking on column headers.

**Properties:**

- `sort_field`: Column being sorted
- `sort_direction`: Direction of sort ("asc" or "desc")
- `previous_field`: Previous sort field
- `timestamp`: Event timestamp

---

### 15. Banned Students - User ID Copied

Triggered when user copies a user ID to clipboard.

**Properties:**

- `user_id`: The user ID that was copied
- `timestamp`: Event timestamp

---

## Manage Students - Deactivated

**URL**: `https://admin.walky.app/v2/manage-students/deactivated`

**Events being tracked:**

### 1. Deactivated Students - Search Input

Triggered when user types in the search field.

**Properties:**

- `search_query`: Search term entered
- `timestamp`: Event timestamp

### 2. Deactivated Students - Data Exported

Triggered when user clicks the export button.

**Properties:**

- `total_students`: Number of students being exported
- `timestamp`: Event timestamp

### 3. Deactivated Students - View Profile Action

Triggered when user clicks "View profile" in the actions dropdown.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `student_status`: Status of the student
- `timestamp`: Event timestamp

### 4. Deactivated Students - Send Email Action

Triggered when user clicks "Send email" in the actions dropdown.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `student_email`: Email of the student
- `timestamp`: Event timestamp

### 5. Deactivated Students - Flag User Action

Triggered when user clicks "Flag" in the actions dropdown.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `already_flagged`: Whether the user was already flagged
- `timestamp`: Event timestamp

### 6. Deactivated Students - Activate User Action

Triggered when user clicks "Activate user" in the actions dropdown.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 7. Deactivated Students - Flag User Confirmed

Triggered when user confirms flagging a user in the modal.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 8. Deactivated Students - Flag User Modal Closed

Triggered when user closes the flag user modal without confirming.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 9. Deactivated Students - Activate User Confirmed

Triggered when user confirms activating a user in the modal.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 10. Deactivated Students - Activate User Modal Closed

Triggered when user closes the activate user modal without confirming.

**Properties:**

- `student_id`: ID of the student
- `student_name`: Name of the student
- `timestamp`: Event timestamp

---

### 11. Deactivated Students - Table Sorted

Triggered when user sorts the table by clicking on column headers.

**Properties:**

- `sort_field`: Column being sorted
- `sort_direction`: Direction of sort ("asc" or "desc")
- `previous_field`: Previous sort field
- `timestamp`: Event timestamp

---

### 12. Deactivated Students - User ID Copied

Triggered when user copies a user ID to clipboard.

**Properties:**

- `user_id`: The user ID that was copied
- `timestamp`: Event timestamp

---

## Manage Students - Disengaged

**URL**: `https://admin.walky.app/v2/manage-students/disengaged`

**Events being tracked:**

### 1. Disengaged Students - Data Exported

Triggered when user clicks the export button.

**Properties:**

- `total_students`: Number of students being exported
- `timestamp`: Event timestamp

### 2. Disengaged Students - Send Outreach Action

Triggered when user clicks "Send outreach" button.

**Properties:**

- `student_name`: Name of the student
- `student_email`: Email of the student
- `peers_count`: Number of peers
- `ignored_invitations`: Number of invitations ignored
- `timestamp`: Event timestamp

### 3. Disengaged Students - View Profile Action

Triggered when user clicks on a student row.

**Properties:**

- `student_name`: Name of the student
- `peers_count`: Number of peers
- `ignored_invitations`: Number of invitations ignored
- `is_reported`: Whether the student has been reported
- `timestamp`: Event timestamp

---

## Events Manager

**URL**: `https://admin.walky.app/v2/events`

**Events being tracked:**

### 1. Events Manager - View Mode Changed

Triggered when user toggles between list view and calendar view.

**Properties:**

- `viewMode`: Selected view mode (`list` or `calendar`)
- `timestamp`: Event timestamp

### 2. Events Manager - Search Input Changed

Triggered when user types in the search input.

**Properties:**

- `query`: Search query text
- `timestamp`: Event timestamp

### 3. Events Manager - Type Filter Changed

Triggered when user changes the event type filter.

**Properties:**

- `filter`: Selected filter value (`all`, `public`, or `private`)
- `timestamp`: Event timestamp

### 4. Events Manager - Page Changed

Triggered when user navigates to a different page in the pagination.

**Properties:**

- `page`: New page number
- `timestamp`: Event timestamp

### 5. Events Manager - View Event Action

Triggered when user clicks "View event" in the dropdown menu.

**Properties:**

- `eventId`: ID of the event
- `eventName`: Name of the event
- `timestamp`: Event timestamp

### 6. Events Manager - Flag Event Action

Triggered when user clicks "Flag event" in the dropdown menu.

**Properties:**

- `eventId`: ID of the event
- `eventName`: Name of the event
- `timestamp`: Event timestamp

### 7. Events Manager - Flag Event Confirmed

Triggered when user confirms flagging an event.

**Properties:**

- `eventId`: ID of the event
- `eventName`: Name of the event
- `reason`: Reason for flagging
- `timestamp`: Event timestamp

### 8. Events Manager - Flag Event Modal Closed

Triggered when user closes the flag event modal without confirming.

**Properties:**

- `timestamp`: Event timestamp

### 9. Events Manager - Unflag Event Action

Triggered when user clicks "Unflag" in the dropdown menu for a flagged event.

**Properties:**

- `eventId`: ID of the event
- `eventName`: Name of the event
- `timestamp`: Event timestamp

### 10. Events Manager - Unflag Event Confirmed

Triggered when user confirms unflagging an event.

**Properties:**

- `eventId`: ID of the event
- `eventName`: Name of the event
- `timestamp`: Event timestamp

### 11. Events Manager - Unflag Event Modal Closed

Triggered when user closes the unflag event modal without confirming.

**Properties:**

- `timestamp`: Event timestamp

### 12. Events Manager - Delete Event Action

Triggered when user clicks "Delete event" in the dropdown menu.

**Properties:**

- `eventId`: ID of the event
- `eventName`: Name of the event
- `timestamp`: Event timestamp

### 13. Events Manager - Delete Event Confirmed

Triggered when user confirms deleting an event.

**Properties:**

- `eventId`: ID of the event
- `eventName`: Name of the event
- `reason`: Reason for deletion
- `timestamp`: Event timestamp

### 14. Events Manager - Delete Event Modal Closed

Triggered when user closes the delete event modal without confirming.

**Properties:**

- `timestamp`: Event timestamp

### 15. Events Manager - Table Sorted

Triggered when user clicks on a sortable column header.

**Properties:**

- `sortField`: Field being sorted (`eventName`, `organizer`, `eventDate`, or `attendees`)
- `sortDirection`: Sort direction (`asc` or `desc`)
- `timestamp`: Event timestamp

---

## Events Insights

**URL**: `https://admin.walky.app/v2/events/insights`

**Events being tracked:**

### 1. Events Insights - Data Exported

Triggered when user clicks the export button.

**Properties:**

- `timestamp`: Event timestamp

### 2. Events Insights - Time Period Changed

Triggered when user changes the time period filter.

**Properties:**

- `timePeriod`: Selected time period (`all`, `week`, or `month`)
- `timestamp`: Event timestamp

---

## Spaces Manager

**URL**: `https://admin.walky.app/v2/spaces`

**Events being tracked:**

### 1. Spaces Manager - Search Input Changed

Triggered when user types in the search input.

**Properties:**

- `query`: Search query text
- `timestamp`: Event timestamp

### 2. Spaces Manager - Category Filter Changed

Triggered when user changes the space category filter.

**Properties:**

- `category`: Selected category (`all`, `clubs`, `club-sports`, `im-teams`, `sororities`, `fraternities`, `volunteer`, `academics`, `leadership`, or `cultural`)
- `timestamp`: Event timestamp

### 3. Spaces Manager - Page Changed

Triggered when user navigates to a different page in the pagination.

**Properties:**

- `page`: New page number
- `timestamp`: Event timestamp

### 4. Spaces Manager - View Space Details Action

Triggered when user clicks "Space Details" in the dropdown menu.

**Properties:**

- `spaceId`: ID of the space
- `spaceName`: Name of the space
- `timestamp`: Event timestamp

### 5. Spaces Manager - Flag Space Action

Triggered when user clicks "Flag" in the dropdown menu.

**Properties:**

- `spaceId`: ID of the space
- `spaceName`: Name of the space
- `timestamp`: Event timestamp

### 6. Spaces Manager - Flag Space Confirmed

Triggered when user confirms flagging a space.

**Properties:**

- `spaceId`: ID of the space
- `spaceName`: Name of the space
- `reason`: Reason for flagging
- `timestamp`: Event timestamp

### 7. Spaces Manager - Flag Space Modal Closed

Triggered when user closes the flag space modal without confirming.

**Properties:**

- `timestamp`: Event timestamp

### 8. Spaces Manager - Unflag Space Action

Triggered when user clicks "Unflag" in the dropdown menu for a flagged space.

**Properties:**

- `spaceId`: ID of the space
- `spaceName`: Name of the space
- `timestamp`: Event timestamp

### 9. Spaces Manager - Unflag Space Confirmed

Triggered when user confirms unflagging a space.

**Properties:**

- `spaceId`: ID of the space
- `spaceName`: Name of the space
- `timestamp`: Event timestamp

### 10. Spaces Manager - Unflag Space Modal Closed

Triggered when user closes the unflag space modal without confirming.

**Properties:**

- `timestamp`: Event timestamp

### 11. Spaces Manager - Delete Space Action

Triggered when user clicks "Delete Space" in the dropdown menu.

**Properties:**

- `spaceId`: ID of the space
- `spaceName`: Name of the space
- `timestamp`: Event timestamp

### 12. Spaces Manager - Delete Space Confirmed

Triggered when user confirms deleting a space.

**Properties:**

- `spaceId`: ID of the space
- `spaceName`: Name of the space
- `reason`: Reason for deletion
- `timestamp`: Event timestamp

### 13. Spaces Manager - Delete Space Modal Closed

Triggered when user closes the delete space modal without confirming.

**Properties:**

- `timestamp`: Event timestamp

### 14. Spaces Manager - Table Sorted

Triggered when user clicks on a sortable column header.

**Properties:**

- `sortField`: Field being sorted (`spaceName`, `owner`, `events`, `members`, or `creationDate`)
- `sortDirection`: Sort direction (`asc` or `desc`)
- `timestamp`: Event timestamp

---

## Spaces Insights

**URL**: `https://admin.walky.app/v2/spaces/insights`

**Events being tracked:**

### 1. Spaces Insights - Data Exported

Triggered when user clicks the export button.

**Properties:**

- `timestamp`: Event timestamp

### 2. Spaces Insights - Time Period Changed

Triggered when user changes the time period filter.

**Properties:**

- `timePeriod`: Selected time period (`all`, `week`, or `month`)
- `timestamp`: Event timestamp

---

## Ideas Manager

**URL**: `https://admin.walky.app/v2/ideas`

**Events being tracked:**

### 1. Ideas Manager - Search Input Changed

Triggered when user types in the search input.

**Properties:**

- `query`: Search query text
- `timestamp`: Event timestamp

### 2. Ideas Manager - Page Changed

Triggered when user navigates to a different page in the pagination.

**Properties:**

- `page`: New page number
- `timestamp`: Event timestamp

### 3. Ideas Manager - View Idea Details Action

Triggered when user clicks "Idea Details" in the dropdown menu.

**Properties:**

- `ideaId`: ID of the idea
- `ideaTitle`: Title of the idea
- `timestamp`: Event timestamp

### 4. Ideas Manager - Flag Idea Action

Triggered when user clicks "Flag" in the dropdown menu.

**Properties:**

- `ideaId`: ID of the idea
- `ideaTitle`: Title of the idea
- `timestamp`: Event timestamp

### 5. Ideas Manager - Flag Idea Confirmed

Triggered when user confirms flagging an idea.

**Properties:**

- `ideaId`: ID of the idea
- `ideaTitle`: Title of the idea
- `reason`: Reason for flagging
- `timestamp`: Event timestamp

### 6. Ideas Manager - Flag Idea Modal Closed

Triggered when user closes the flag idea modal without confirming.

**Properties:**

- `timestamp`: Event timestamp

### 7. Ideas Manager - Unflag Idea Action

Triggered when user clicks "Unflag" in the dropdown menu for a flagged idea.

**Properties:**

- `ideaId`: ID of the idea
- `ideaTitle`: Title of the idea
- `timestamp`: Event timestamp

### 8. Ideas Manager - Unflag Idea Confirmed

Triggered when user confirms unflagging an idea.

**Properties:**

- `ideaId`: ID of the idea
- `ideaTitle`: Title of the idea
- `timestamp`: Event timestamp

### 9. Ideas Manager - Unflag Idea Modal Closed

Triggered when user closes the unflag idea modal without confirming.

**Properties:**

- `timestamp`: Event timestamp

### 10. Ideas Manager - Delete Idea Action

Triggered when user clicks "Delete Idea" in the dropdown menu.

**Properties:**

- `ideaId`: ID of the idea
- `ideaTitle`: Title of the idea
- `timestamp`: Event timestamp

### 11. Ideas Manager - Delete Idea Confirmed

Triggered when user confirms deleting an idea.

**Properties:**

- `ideaId`: ID of the idea
- `ideaTitle`: Title of the idea
- `reason`: Reason for deletion
- `timestamp`: Event timestamp

### 12. Ideas Manager - Delete Idea Modal Closed

Triggered when user closes the delete idea modal without confirming.

**Properties:**

- `timestamp`: Event timestamp

### 13. Ideas Manager - Table Sorted

Triggered when user clicks on a sortable column header.

**Properties:**

- `sortField`: Field being sorted (`ideaTitle`, `owner`, `collaborated`, or `creationDate`)
- `sortDirection`: Sort direction (`asc` or `desc`)
- `timestamp`: Event timestamp

---

## Ideas Insights

**URL**: `https://admin.walky.app/v2/ideas/insights`

**Events being tracked:**

### 1. Ideas Insights - Data Exported

Triggered when user clicks the export button.

**Properties:**

- `timestamp`: Event timestamp

### 2. Ideas Insights - Time Period Changed

Triggered when user changes the time period filter.

**Properties:**

- `timePeriod`: Selected time period (`all`, `week`, or `month`)
- `timestamp`: Event timestamp

---

## Report Safety

**URL**: `https://admin.walky.app/v2/report-safety`

**Events being tracked:**

### 1. Report Safety - Search Input Changed

Triggered when user types in the search input to filter reports.

**Properties:**

- `query`: Search query text
- `timestamp`: Event timestamp

### 2. Report Safety - Type Filter Changed

Triggered when user selects/deselects report types in the multi-select dropdown.

**Properties:**

- `selectedTypes`: Array of selected types (e.g., `["User", "Message", "Event"]`)
- `timestamp`: Event timestamp

**Available Options:**

- User
- Message
- Event
- Idea
- Space

### 3. Report Safety - Status Filter Changed

Triggered when user changes the status filter dropdown.

**Properties:**

- `status`: Selected status (`all`, `Pending review`, or `Under evaluation`)
- `timestamp`: Event timestamp

### 4. Report Safety - Data Exported

Triggered when user clicks the export button.

**Properties:**

- `timestamp`: Event timestamp

### 5. Report Safety - Report Details Opened

Triggered when user clicks on a report description to open details.

**Properties:**

- `reportId`: ID of the report
- `reportType`: Type of report (`User`, `Message`, `Event`, `Idea`, or `Space`)
- `timestamp`: Event timestamp

### 6. Report Safety - Status Changed

Triggered when user changes the status via the status dropdown in the table.

**Properties:**

- `reportId`: ID of the report
- `oldStatus`: Previous status
- `newStatus`: New status selected
- `timestamp`: Event timestamp

**Status Options:**

- Pending review
- Under evaluation
- Resolved
- Dismissed

### 7. Report Safety - Note Required

Triggered when changing status requires a note (Resolved/Dismissed).

**Properties:**

- `reportId`: ID of the report
- `newStatus`: Status that requires a note
- `timestamp`: Event timestamp

### 8. Report Safety - Report Details Clicked (Action)

Triggered when user clicks "Report details" from the action dropdown.

**Properties:**

- `reportId`: ID of the report
- `reportType`: Type of report
- `timestamp`: Event timestamp

### 9. Report Safety - Flag Clicked

Triggered when user clicks "Flag" from the action dropdown.

**Properties:**

- `reportId`: ID of the report
- `timestamp`: Event timestamp

### 10. Report Safety - Write Note Modal Closed

Triggered when user closes the write note modal.

**Properties:**

- `timestamp`: Event timestamp

### 11. Report Safety - Note Confirmed

Triggered when user confirms a note for status change.

**Properties:**

- `reportId`: ID of the report
- `newStatus`: Status being applied with note
- `timestamp`: Event timestamp

### 12. Report Safety - Report Detail Modal Closed

Triggered when user closes the report detail modal.

**Properties:**

- `timestamp`: Event timestamp

### 13. Report Safety - Safety Tab Changed

Triggered when user switches tabs in the report detail modal.

**Properties:**

- `tab`: Tab selected (`ban`, `report`, or `block`)
- `timestamp`: Event timestamp

**Available Tabs:**

- Ban history
- Report history
- Block history

### 14. Report Safety - Deactivate User Action

Triggered when user clicks deactivate user button in the report detail modal.

**Properties:**

- `reportId`: ID of the report
- `userId`: Student ID being deactivated
- `timestamp`: Event timestamp

### 15. Report Safety - Ban User Action

Triggered when user clicks ban user button in the report detail modal.

**Properties:**

- `reportId`: ID of the report
- `userId`: Student ID being banned
- `timestamp`: Event timestamp

### 16. Report Safety - Flag Modal Closed

Triggered when user closes the flag modal.

**Properties:**

- `timestamp`: Event timestamp

### 17. Report Safety - Flag Report Confirmed

Triggered when user confirms flagging a report.

**Properties:**

- `reportId`: ID of the report being flagged
- `reason`: Reason for flagging
- `timestamp`: Event timestamp

---

## Report History

**URL**: `https://admin.walky.app/v2/report-history`

**Events being tracked:**

### 1. Report History - Search Input Changed

Triggered when user types in the search input to filter historical reports.

**Properties:**

- `query`: Search query text
- `timestamp`: Event timestamp

### 2. Report History - Type Filter Changed

Triggered when user selects/deselects report types in the multi-select dropdown.

**Properties:**

- `selectedTypes`: Array of selected types (e.g., `["User", "Message", "Event"]`)
- `timestamp`: Event timestamp

**Available Options:**

- User
- Message
- Event
- Idea
- Space

### 3. Report History - Status Filter Changed

Triggered when user changes the status filter dropdown.

**Properties:**

- `status`: Selected status (`all`, `Pending review`, `Under evaluation`, `Resolved`, or `Dismissed`)
- `timestamp`: Event timestamp

### 4. Report History - Data Exported

Triggered when user clicks the export button.

**Properties:**

- `timestamp`: Event timestamp

### 5. Report History - Report Details Opened

Triggered when user clicks on a report description to open details.

**Properties:**

- `reportId`: ID of the report
- `reportType`: Type of report (`User`, `Message`, `Event`, `Idea`, or `Space`)
- `timestamp`: Event timestamp

### 6. Report History - Status Changed

Triggered when user changes the status via the status dropdown in the table.

**Properties:**

- `reportId`: ID of the report
- `oldStatus`: Previous status
- `newStatus`: New status selected (typically `Reopen`)
- `timestamp`: Event timestamp

**Status Options:**

- Reopen

### 7. Report History - Note Required

Triggered when changing status requires a note.

**Properties:**

- `reportId`: ID of the report
- `newStatus`: Status that requires a note
- `timestamp`: Event timestamp

### 8. Report History - Report Details Clicked (Action)

Triggered when user clicks "Report details" from the action dropdown.

**Properties:**

- `reportId`: ID of the report
- `reportType`: Type of report
- `timestamp`: Event timestamp

### 9. Report History - Flag Clicked

Triggered when user clicks "Flag" from the action dropdown.

**Properties:**

- `reportId`: ID of the report
- `timestamp`: Event timestamp

### 10. Report History - Page Changed

Triggered when user navigates between pages using Previous/Next buttons.

**Properties:**

- `page`: New page number
- `timestamp`: Event timestamp

### 11. Report History - Write Note Modal Closed

Triggered when user closes the write note modal.

**Properties:**

- `timestamp`: Event timestamp

### 12. Report History - Note Confirmed

Triggered when user confirms a note for status change.

**Properties:**

- `reportId`: ID of the report
- `newStatus`: Status being applied with note
- `timestamp`: Event timestamp

### 13. Report History - Report Detail Modal Closed

Triggered when user closes the report detail modal.

**Properties:**

- `timestamp`: Event timestamp

### 14. Report History - Safety Tab Changed

Triggered when user switches tabs in the report detail modal.

**Properties:**

- `tab`: Tab selected (`ban`, `report`, or `block`)
- `timestamp`: Event timestamp

**Available Tabs:**

- Ban history
- Report history
- Block history

### 15. Report History - Deactivate User Action

Triggered when user clicks deactivate user button in the report detail modal.

**Properties:**

- `reportId`: ID of the report
- `userId`: Student ID being deactivated
- `timestamp`: Event timestamp

### 16. Report History - Ban User Action

Triggered when user clicks ban user button in the report detail modal.

**Properties:**

- `reportId`: ID of the report
- `userId`: Student ID being banned
- `timestamp`: Event timestamp

### 17. Report History - Flag Modal Closed

Triggered when user closes the flag modal.

**Properties:**

- `timestamp`: Event timestamp

### 18. Report History - Flag Report Confirmed

Triggered when user confirms flagging a report.

**Properties:**

- `reportId`: ID of the report being flagged
- `reason`: Reason for flagging
- `timestamp`: Event timestamp

---

## Campuses

**URL**: `https://admin.walky.app/v2/admin/campuses`

**Events being tracked:**

### 1. Campuses - Campus Expanded

Triggered when user clicks to expand a campus row to view boundary map.

**Properties:**

- `campusId`: ID of the campus being expanded
- `timestamp`: Event timestamp

### 2. Campuses - Campus Collapsed

Triggered when user clicks to collapse an expanded campus row.

**Properties:**

- `campusId`: ID of the campus being collapsed
- `timestamp`: Event timestamp

### 3. Campuses - Sync Places Clicked

Triggered when user clicks the sync places button for a campus.

**Properties:**

- `campusId`: ID of the campus
- `campusName`: Name of the campus
- `timestamp`: Event timestamp

---

## Ambassadors

**URL**: `https://admin.walky.app/v2/admin/ambassadors`

**Events being tracked:**

### 1. Ambassadors - Add Ambassador Button Clicked

Triggered when user clicks the "+ Add a new Ambassador" button.

**Properties:**

- `timestamp`: Event timestamp

### 2. Ambassadors - Ambassadors Added

Triggered when user confirms adding ambassadors in the modal.

**Properties:**

- `count`: Number of ambassadors added
- `timestamp`: Event timestamp

### 3. Ambassadors - Delete Ambassador Button Clicked

Triggered when user clicks the delete button for an ambassador.

**Properties:**

- `ambassadorId`: ID of the ambassador
- `ambassadorName`: Name of the ambassador
- `timestamp`: Event timestamp

### 4. Ambassadors - Ambassador Deleted

Triggered when user confirms deleting an ambassador.

**Properties:**

- `ambassadorId`: ID of the deleted ambassador
- `ambassadorName`: Name of the deleted ambassador
- `timestamp`: Event timestamp

### 5. Ambassadors - Student ID Copied

Triggered when user clicks the copy button for a student ID.

**Properties:**

- `ambassadorId`: ID of the ambassador
- `timestamp`: Event timestamp

### 6. Ambassadors - Add Ambassador Modal Closed

Triggered when user closes the add ambassador modal.

**Properties:**

- `timestamp`: Event timestamp

### 7. Ambassadors - Delete Ambassador Modal Closed

Triggered when user closes the delete ambassador modal.

**Properties:**

- `timestamp`: Event timestamp

---

## Role Management

**URL**: `https://admin.walky.app/v2/admin/role-management`

**Events being tracked:**

### 1. Role Management - Search Input Changed

Triggered when user types in the search input to filter members.

**Properties:**

- `query`: Search query text
- `timestamp`: Event timestamp

### 2. Role Management - Role Filter Changed

Triggered when user changes the role filter dropdown.

**Properties:**

- `role`: Selected role filter (`All Roles`, `Walky Admin`, `School Admin`, `Campus Admin`, or `Moderator`)
- `timestamp`: Event timestamp

### 3. Role Management - Create Member Button Clicked

Triggered when user clicks the "+ Create new member" button.

**Properties:**

- `timestamp`: Event timestamp

### 4. Role Management - Role Badge Clicked

Triggered when user clicks on a role badge to view role permissions.

**Properties:**

- `role`: Role that was clicked (`Walky Admin`, `School Admin`, `Campus Admin`, or `Moderator`)
- `timestamp`: Event timestamp

### 5. Role Management - Change Role Action Clicked

Triggered when user clicks "Change role" from the action dropdown.

**Properties:**

- `memberId`: ID of the member
- `memberName`: Name of the member
- `currentRole`: Current role of the member
- `timestamp`: Event timestamp

### 6. Role Management - Send Password Reset Action Clicked

Triggered when user clicks "Send a password reset" from the action dropdown.

**Properties:**

- `memberId`: ID of the member
- `memberEmail`: Email of the member
- `timestamp`: Event timestamp

### 7. Role Management - Remove Member Action Clicked

Triggered when user clicks "Remove member" from the action dropdown.

**Properties:**

- `memberId`: ID of the member
- `memberName`: Name of the member
- `timestamp`: Event timestamp

### 8. Role Management - Member Removed

Triggered when user confirms removing a member.

**Properties:**

- `memberId`: ID of the removed member
- `memberName`: Name of the removed member
- `timestamp`: Event timestamp

### 9. Role Management - Role Changed

Triggered when user confirms changing a member's role.

**Properties:**

- `memberId`: ID of the member
- `memberName`: Name of the member
- `oldRole`: Previous role
- `newRole`: New role assigned
- `timestamp`: Event timestamp

### 10. Role Management - Password Reset Sent

Triggered when user confirms sending a password reset email.

**Properties:**

- `memberId`: ID of the member
- `memberEmail`: Email of the member
- `dontShowAgain`: Whether user checked "Don't show this again"
- `timestamp`: Event timestamp

### 11. Role Management - Member Created

Triggered when user confirms creating a new member.

**Properties:**

- `email`: Email of the new member
- `role`: Role assigned to the new member
- `timestamp`: Event timestamp

### 12. Role Management - Role Permissions Modal Closed

Triggered when user closes the role permissions modal.

**Properties:**

- `role`: Role that was being viewed
- `timestamp`: Event timestamp

### 13. Role Management - Remove Member Modal Closed

Triggered when user closes the remove member modal without confirming.

**Properties:**

- `timestamp`: Event timestamp

### 14. Role Management - Change Role Modal Closed

Triggered when user closes the change role modal without confirming.

**Properties:**

- `timestamp`: Event timestamp

### 15. Role Management - Password Reset Modal Closed

Triggered when user closes the password reset modal without confirming.

**Properties:**

- `timestamp`: Event timestamp

### 16. Role Management - Create Member Modal Closed

Triggered when user closes the create member modal without confirming.

**Properties:**

- `timestamp`: Event timestamp

---

## Administrator Settings

**Component**: `AdministratorSettings`

**Page Path**: `/v2/admin/settings`

**Description**: Multi-tab settings page for administrator account management with personal information, security settings, notification preferences, and danger zone.

**Events being tracked:**

### 1. Administrator Settings - Tab Switched

Triggered when user switches between settings tabs.

**Properties:**

- `tab`: Name of the tab switched to (Personal Information, Security Settings, Notification Preferences, Danger Zone)
- `timestamp`: Event timestamp

### 2. Administrator Settings - Back Button Clicked

Triggered when user clicks the back button to return to admin panel.

**Properties:**

- `hasUnsavedChanges`: Boolean indicating if there are unsaved changes
- `timestamp`: Event timestamp

### 3. Administrator Settings - Profile Picture Edit Clicked

Triggered when user clicks the edit button on their profile picture.

**Properties:**

- `timestamp`: Event timestamp

### 4. Administrator Settings - Position Input Changed

Triggered when user modifies the position field in personal information.

**Properties:**

- `timestamp`: Event timestamp

### 5. Administrator Settings - Save Changes Clicked

Triggered when user clicks save changes button for personal information.

**Properties:**

- `timestamp`: Event timestamp

### 6. Administrator Settings - Current Password Input Changed

Triggered when user types in the current password field in security settings.

**Properties:**

- `timestamp`: Event timestamp

### 7. Administrator Settings - New Password Input Changed

Triggered when user types in the new password field in security settings.

**Properties:**

- `timestamp`: Event timestamp

### 8. Administrator Settings - Confirm Password Input Changed

Triggered when user types in the confirm password field in security settings.

**Properties:**

- `timestamp`: Event timestamp

### 9. Administrator Settings - Change Password Clicked

Triggered when user clicks the change password button.

**Properties:**

- `timestamp`: Event timestamp

### 10. Administrator Settings - Two-Factor Toggle Changed

Triggered when user toggles two-factor authentication on or off.

**Properties:**

- `enabled`: Boolean indicating if two-factor auth is being enabled or disabled
- `timestamp`: Event timestamp

### 11. Administrator Settings - Logout All Devices Clicked

Triggered when user clicks the logout all devices button.

**Properties:**

- `timestamp`: Event timestamp

### 12. Administrator Settings - Email Notifications Toggle Changed

Triggered when user toggles email notifications on or off.

**Properties:**

- `enabled`: Boolean indicating if email notifications are being enabled or disabled
- `timestamp`: Event timestamp

### 13. Administrator Settings - Security Alerts Toggle Changed

Triggered when user toggles security alerts on or off.

**Properties:**

- `enabled`: Boolean indicating if security alerts are being enabled or disabled
- `timestamp`: Event timestamp

### 14. Administrator Settings - Delete Reason Input Changed

Triggered when user types in the delete reason textarea in danger zone.

**Properties:**

- `timestamp`: Event timestamp

### 15. Administrator Settings - Submit Delete Request Clicked

Triggered when user clicks the submit delete request button in danger zone.

**Properties:**

- `timestamp`: Event timestamp

### 16. Administrator Settings - Unsaved Changes Modal Closed

Triggered when user closes the unsaved changes modal (stays on page).

**Properties:**

- `action`: Always "stay"
- `timestamp`: Event timestamp

### 17. Administrator Settings - Unsaved Changes Modal Leave Clicked

Triggered when user confirms leaving with unsaved changes.

**Properties:**

- `timestamp`: Event timestamp

### 18. Administrator Settings - Delete Account Modal Closed

Triggered when user closes the delete account confirmation modal.

**Properties:**

- `timestamp`: Event timestamp

### 19. Administrator Settings - Delete Account Confirmed

Triggered when user confirms account deletion in the modal.

**Properties:**

- `timestamp`: Event timestamp

### 20. Administrator Settings - Logout All Devices Modal Closed

Triggered when user closes the logout all devices modal.

**Properties:**

- `timestamp`: Event timestamp

### 21. Administrator Settings - Logout All Devices Confirmed

Triggered when user confirms logging out all devices.

**Properties:**

- `timestamp`: Event timestamp

---

## Authentication Pages

### Login V2

**Component**: `LoginV2`

**Page Path**: `/login-v2`

**Description**: Main authentication login page for V2 admin interface.

**Events being tracked:**

#### 1. Login V2 - Email Input Changed

Triggered when user types in the email input field.

**Properties:**

- `timestamp`: Event timestamp

#### 2. Login V2 - Password Input Changed

Triggered when user types in the password input field.

**Properties:**

- `timestamp`: Event timestamp

#### 3. Login V2 - Form Submitted

Triggered when user submits the login form.

**Properties:**

- `email`: Email address submitted
- `timestamp`: Event timestamp

#### 4. Login V2 - Forgot Password Clicked

Triggered when user clicks the forgot password link.

**Properties:**

- `timestamp`: Event timestamp

---

### Recover Password V2

**Component**: `RecoverPasswordV2` (with VerifyCodeStep and ResetPasswordStep)

**Page Path**: `/recover-password`

**Description**: Multi-step password recovery flow with email submission, code verification, and password reset.

**Events being tracked:**

#### Step 1: Email Submission

##### 1. Recover Password V2 - Email Input Changed

Triggered when user types in the email input field.

**Properties:**

- `timestamp`: Event timestamp

##### 2. Recover Password V2 - Email Submitted

Triggered when user submits the email to receive reset link.

**Properties:**

- `email`: Email address submitted
- `timestamp`: Event timestamp

##### 3. Recover Password V2 - Back to Login Clicked

Triggered when user clicks back to login button on email step.

**Properties:**

- `timestamp`: Event timestamp

#### Step 2: Code Verification

##### 4. Recover Password V2 - Verification Code Input Changed

Triggered when user types in the verification code input field.

**Properties:**

- `timestamp`: Event timestamp

##### 5. Recover Password V2 - Verification Code Submitted

Triggered when user submits the verification code.

**Properties:**

- `email`: Email address for verification
- `timestamp`: Event timestamp

##### 6. Recover Password V2 - Resend Code Button Clicked

Triggered when user clicks the resend code button.

**Properties:**

- `email`: Email address to resend code to
- `timestamp`: Event timestamp

##### 7. Recover Password V2 - Code Verified

Triggered when verification code is successfully verified.

**Properties:**

- `email`: Email address verified
- `timestamp`: Event timestamp

##### 8. Recover Password V2 - Resend Code Clicked

Triggered when resend code handler is invoked (from main component).

**Properties:**

- `email`: Email address to resend code to
- `timestamp`: Event timestamp

#### Step 3: Password Reset

##### 9. Recover Password V2 - New Password Input Changed

Triggered when user types in the new password field.

**Properties:**

- `timestamp`: Event timestamp

##### 10. Recover Password V2 - Confirm Password Input Changed

Triggered when user types in the confirm password field.

**Properties:**

- `timestamp`: Event timestamp

##### 11. Recover Password V2 - Reset Password Submitted

Triggered when user submits the new password.

**Properties:**

- `timestamp`: Event timestamp

##### 12. Recover Password V2 - Reset Password Error

Triggered when password reset validation fails.

**Properties:**

- `error`: Description of the error (e.g., "Passwords do not match", "Password too short")
- `timestamp`: Event timestamp

##### 13. Recover Password V2 - Password Reset Complete

Triggered when password reset is successfully completed.

**Properties:**

- `email`: Email address for the reset account
- `timestamp`: Event timestamp

---

## How to Verify

**Development Console:**
Open browser DevTools → Console to see:

```
✅ [Mixpanel Event]: Time Period Changed { previous_value: 'month', new_value: 'week' }
```

**Mixpanel Dashboard:**
Go to https://mixpanel.com/ → Events or Live View
