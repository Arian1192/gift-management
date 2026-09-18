# VITO Bridge

This directory contains the foundation for the future VITO integration.

The current bridge behavior is intentionally limited to safe maintainer operations:

- validates the configuration names the bridge expects;
- provides a local no-network health/check command;
- provides an explicit read-only connection probe command for real local VITO credentials;
- provides an explicit read-only data discovery command that summarizes configured VITO resource shapes;
- performs no gift, customer, order, inventory, or user data synchronization.

## Configuration

Use environment variables for VITO bridge configuration:

| Name | Purpose | Secret? |
| --- | --- | --- |
| `VITO_BASE_URL` | Base URL for the future VITO API integration. | No |
| `VITO_API_TOKEN` | Token or credential used by future VITO API calls. | Yes |
| `VITO_PROBE_PATH` | Least-sensitive read-only VITO status/health path used by the live probe. | No |
| `VITO_PROBE_TIMEOUT_MS` | Probe timeout in milliseconds. Defaults to `5000` when omitted or invalid. | No |
| `VITO_DISCOVERY_PATHS` | Comma-separated read-only discovery paths. Use `name:/path` or `/path`. | No |
| `VITO_DISCOVERY_TIMEOUT_MS` | Discovery request timeout in milliseconds. Defaults to `5000` when omitted or invalid. | No |

`bridge/env.example` contains safe placeholder values only. For local development, copy it to `bridge/.env` and replace values outside version control.

Do not commit real VITO credentials, tokens, private endpoints, or customer data.

## Verification

Run the bridge-local tests:

```sh
npm --prefix bridge test
```

Run the local foundation check with safe placeholder configuration:

```sh
npm --prefix bridge run check
```

The check confirms configuration is present and reports readiness. It does not contact VITO and does not synchronize data.

## Live read-only connection probe

The probe is separate from `check` because it intentionally contacts the configured VITO endpoint. Load real local values from ignored environment variables before running it:

```sh
set -a
. bridge/.env
set +a
npm --prefix bridge run probe
```

The probe sends one read-only `GET` request to `VITO_BASE_URL` + `VITO_PROBE_PATH` using the configured credential. It reports one of these safe outcomes:

- connectivity available;
- missing configuration;
- authentication failure;
- network or timeout failure;
- unexpected non-success HTTP response.

Probe output redacts authorization values, does not print raw VITO response payloads, and does not store or synchronize Gift Management or VITO domain data.

## Live read-only data discovery

Discovery is separate from `probe` because it intentionally calls one or more configured VITO resource paths to summarize response shapes. Use only least-sensitive read-only paths.

```sh
set -a
. bridge/.env
set +a
npm --prefix bridge run discover
```

`VITO_DISCOVERY_PATHS` accepts comma-separated entries. Each entry can be named:

```sh
VITO_DISCOVERY_PATHS=customers:/api/customers,gifts:/api/gifts
```

or unnamed:

```sh
VITO_DISCOVERY_PATHS=/api/customers,/api/gifts
```

Discovery output is shape-only. It reports resource names/paths, response status, top-level field names, inferred basic field types, and array item counts. It redacts values, does not print raw VITO payloads, and does not persist discovery results.
