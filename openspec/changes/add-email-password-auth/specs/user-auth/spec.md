## Purpose

User authentication lets Gift Management identify the person using the app so later gift data can be scoped to the correct signed-in user.

## ADDED Requirements

### Requirement: User can create an account with email and password
The system SHALL allow a visitor to create a user account with an email address and password through the web application.

#### Scenario: Successful account creation
- **WHEN** a visitor submits a valid email and valid password on the sign-up form
- **THEN** the system creates or requests creation of a Supabase Auth user and shows the visitor the next authentication state

#### Scenario: Invalid account creation input
- **WHEN** a visitor submits a missing email, malformed email, or invalid password
- **THEN** the system shows a clear validation or authentication error without creating a signed-in session

### Requirement: User can sign in with email and password
The system SHALL allow an existing user to sign in with email and password through the web application.

#### Scenario: Successful sign-in
- **WHEN** an existing user submits valid credentials on the sign-in form
- **THEN** the system establishes an authenticated session and shows the signed-in state

#### Scenario: Failed sign-in
- **WHEN** a user submits unknown or incorrect credentials
- **THEN** the system keeps the user signed out and shows a clear authentication error

### Requirement: User session persists across reloads
The system SHALL preserve a valid authenticated session across page reloads in the same browser.

#### Scenario: Reload with active session
- **WHEN** an authenticated user reloads the web application
- **THEN** the system restores the signed-in state without requiring credentials again

#### Scenario: Load without active session
- **WHEN** a visitor opens the web application without a valid authenticated session
- **THEN** the system shows the signed-out state and authentication entry points

### Requirement: User can sign out
The system SHALL allow an authenticated user to sign out from the web application.

#### Scenario: Successful sign-out
- **WHEN** an authenticated user chooses to sign out
- **THEN** the system ends the local authenticated session and shows the signed-out state

### Requirement: Authentication errors are safe to display
The system SHALL show authentication errors in user-facing language without exposing secrets, tokens, or internal stack traces.

#### Scenario: Supabase returns an authentication error
- **WHEN** Supabase Auth rejects an authentication action
- **THEN** the system shows a concise safe error message and does not render secrets, raw tokens, or stack traces
