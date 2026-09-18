## Purpose

Provides the maintainer-facing contract for safely checking real VITO connectivity before Gift Management imports, exports, persists, or synchronizes any VITO domain data.

## ADDED Requirements

### Requirement: Maintainers can run a read-only VITO connection probe
The system SHALL provide a bridge command that performs one read-only VITO connectivity probe using local configuration and reports whether the configured VITO endpoint can be reached and authenticated.

#### Scenario: Probe succeeds
- **WHEN** a maintainer runs the documented probe command with valid VITO endpoint and credential configuration
- **THEN** the command reports that VITO connectivity is available without printing secret values or raw VITO response payloads

#### Scenario: Probe uses a configured path
- **WHEN** a maintainer configures the probe path or status endpoint
- **THEN** the command sends the read-only probe to that configured path rather than relying on a hardcoded data endpoint

### Requirement: Probe failures are safe and actionable
The system SHALL classify connection probe failures in maintainer-facing language without exposing credentials, tokens, stack traces, or private VITO response payloads.

#### Scenario: Required configuration is missing
- **WHEN** a maintainer runs the probe without required VITO connection configuration
- **THEN** the command fails before making a network request and names the missing configuration keys

#### Scenario: VITO rejects authentication
- **WHEN** VITO responds as unauthenticated or unauthorized
- **THEN** the command reports an authentication failure without printing the configured token

#### Scenario: VITO endpoint is unreachable or times out
- **WHEN** the configured VITO endpoint cannot be reached or does not respond before the configured timeout
- **THEN** the command reports a network or timeout failure with enough context to check endpoint configuration

#### Scenario: VITO returns an unexpected non-success response
- **WHEN** VITO returns a non-success response that is not an authentication failure
- **THEN** the command reports the HTTP status class or code without dumping the full response body

### Requirement: Probe does not synchronize domain data
The VITO connection probe SHALL be limited to connectivity evidence and MUST NOT import, export, persist, or mutate gift-management domain data or VITO domain data.

#### Scenario: Probe runs against VITO
- **WHEN** the connection probe completes successfully or fails
- **THEN** no gift, customer, order, inventory, or user data is stored in Gift Management

#### Scenario: Probe command is reviewed
- **WHEN** maintainers inspect the implemented probe slice
- **THEN** there are no Supabase migrations, RLS policies, seed data, Edge Functions, scheduled jobs, queues, or webhook handlers introduced by this capability
