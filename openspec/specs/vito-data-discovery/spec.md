# vito-data-discovery Specification

## Purpose

Provides the maintainer-facing contract for safely discovering configured VITO resource shapes before Gift Management imports, exports, persists, or synchronizes any VITO domain data.

## Requirements

### Requirement: Maintainers can run read-only VITO data discovery
The system SHALL provide a bridge command that reads configured VITO discovery paths and reports a safe shape summary for each path.

#### Scenario: Discovery succeeds for a configured resource
- **WHEN** a maintainer runs the documented discovery command with valid VITO configuration and at least one configured discovery path
- **THEN** the command reports each successful resource by configured name or path with a redacted shape summary

#### Scenario: Multiple discovery paths are configured
- **WHEN** a maintainer configures more than one discovery path
- **THEN** the command attempts each configured path and reports a result for each path without stopping after the first failed resource

### Requirement: Discovery output is redacted and review-safe
The system SHALL summarize response shapes without printing credentials, authorization headers, raw VITO payloads, or private sample values.

#### Scenario: Discovery receives an object response
- **WHEN** VITO returns a JSON object for a configured discovery path
- **THEN** the command reports top-level field names and basic inferred field types without printing field values

#### Scenario: Discovery receives an array response
- **WHEN** VITO returns a JSON array for a configured discovery path
- **THEN** the command reports the item count and a shape summary inferred from object items without printing item values

#### Scenario: Discovery receives non-JSON or unsupported content
- **WHEN** VITO returns content that cannot be summarized as JSON
- **THEN** the command reports an unsupported content result without dumping the response body

### Requirement: Discovery failures are classified per resource
The system SHALL classify failures for each configured discovery path in maintainer-facing language without hiding other configured paths.

#### Scenario: Required discovery configuration is missing
- **WHEN** a maintainer runs discovery without required discovery configuration
- **THEN** the command fails before making discovery requests and names the missing configuration keys

#### Scenario: One configured resource fails
- **WHEN** one configured discovery path returns authentication, network, timeout, or unexpected-response failure
- **THEN** the command reports that failure for the affected resource and still reports results for other configured resources when possible

### Requirement: Discovery does not synchronize domain data
The VITO data discovery command SHALL be limited to shape evidence and MUST NOT import, export, persist, or mutate Gift Management domain data or VITO domain data.

#### Scenario: Discovery command completes
- **WHEN** discovery succeeds or fails
- **THEN** no VITO response payloads or Gift Management domain records are stored

#### Scenario: Discovery implementation is reviewed
- **WHEN** maintainers inspect the implemented discovery slice
- **THEN** there are no Supabase migrations, RLS policies, seed data, Edge Functions, scheduled jobs, queues, or webhook handlers introduced by this capability
