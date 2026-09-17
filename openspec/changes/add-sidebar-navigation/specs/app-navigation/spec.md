## Purpose

App navigation provides authenticated users with a sidebar to move between sections and keeps unauthenticated users out of protected content.

## ADDED Requirements

### Requirement: Authenticated users see a sidebar with primary sections
The system SHALL display a sidebar on protected routes with navigation items for Home and Profile.

#### Scenario: User is signed in and views a protected route
- **WHEN** an authenticated user visits a protected route
- **THEN** the system renders the sidebar with Home and Profile navigation items and the current page content

#### Scenario: Sidebar item reflects current route
- **WHEN** an authenticated user navigates to Profile
- **THEN** the Profile sidebar item shows an active state

### Requirement: Unauthenticated visitors are redirected from protected routes
The system SHALL redirect visitors without a valid session to the login screen when they access a protected route.

#### Scenario: Visitor opens root path
- **WHEN** a visitor opens `/` without a session
- **THEN** the system redirects to the login route

#### Scenario: Visitor opens profile path directly
- **WHEN** a visitor opens `/profile` without a session
- **THEN** the system redirects to the login route

### Requirement: Signing out redirects to login
The system SHALL redirect the user to the login route after signing out.

#### Scenario: User clicks sign out
- **WHEN** an authenticated user signs out
- **THEN** the system clears the session and redirects to the login route

### Requirement: Protected routes handle session restoration loading
The system SHALL show a loading state while auth session status is unknown, instead of showing protected content or redirecting prematurely.

#### Scenario: User reloads a protected route
- **WHEN** an authenticated user reloads the app on a protected route
- **THEN** the system shows a loading indicator until the session is confirmed, then renders the route, or redirects if the session is invalid

### Requirement: Unknown routes inside the app show a 404 fallback
The system SHALL display a 404 view for routes that are neither protected sections nor the login route.

#### Scenario: User visits non-existent route
- **WHEN** an authenticated user visits `/unknown-route`
- **THEN** the system shows a 404 view inside the authenticated layout

