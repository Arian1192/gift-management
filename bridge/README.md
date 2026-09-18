# VITO Bridge

This directory contains the foundation for the future VITO integration.

The current slice is intentionally limited to a safe local bridge boundary:

- validates the configuration names the bridge expects;
- provides a local health/check command;
- performs no live VITO API calls;
- performs no gift, customer, order, inventory, or user data synchronization.

## Configuration

Use environment variables for VITO bridge configuration:

| Name | Purpose | Secret? |
| --- | --- | --- |
| `VITO_BASE_URL` | Base URL for the future VITO API integration. | No |
| `VITO_API_TOKEN` | Token or credential used by future VITO API calls. | Yes |

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
