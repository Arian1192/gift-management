import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  getRequiredConfigKeys,
  getRequiredDiscoveryConfigKeys,
  getRequiredProbeConfigKeys,
  parseDiscoveryPaths,
  validateBridgeConfig,
  validateDiscoveryConfig,
  validateProbeConfig,
} from './config.js';

describe('validateBridgeConfig', () => {
  it('reports ready when safe local configuration is present', () => {
    const result = validateBridgeConfig({
      VITO_BASE_URL: 'https://vito.example.invalid',
      VITO_API_TOKEN: 'local-placeholder-token',
    });

    assert.equal(result.ok, true);
    assert.equal(result.message, 'VITO bridge foundation configuration is ready.');
    assert.deepEqual(result.config, {
      VITO_BASE_URL: 'https://vito.example.invalid',
      VITO_API_TOKEN: '[redacted]',
    });
  });

  it('reports every missing required configuration key', () => {
    const result = validateBridgeConfig({});

    assert.equal(result.ok, false);
    assert.deepEqual(result.missing, getRequiredConfigKeys());
    assert.match(result.message, /VITO_BASE_URL/);
    assert.match(result.message, /VITO_API_TOKEN/);
  });

  it('does not expose configured secret values in validation output', () => {
    const secret = 'super-secret-token';
    const result = validateBridgeConfig({
      VITO_BASE_URL: 'https://vito.example.invalid',
      VITO_API_TOKEN: secret,
    });

    assert.equal(JSON.stringify(result).includes(secret), false);
  });
});

describe('validateProbeConfig', () => {
  it('requires the probe path in addition to foundation configuration', () => {
    const result = validateProbeConfig({
      VITO_BASE_URL: 'https://vito.example.invalid',
      VITO_API_TOKEN: 'local-placeholder-token',
    });

    assert.equal(result.ok, false);
    assert.deepEqual(result.missing, ['VITO_PROBE_PATH']);
    assert.equal(getRequiredProbeConfigKeys().includes('VITO_PROBE_PATH'), true);
  });

  it('uses the safe default timeout when no override is supplied', () => {
    const result = validateProbeConfig({
      VITO_BASE_URL: 'https://vito.example.invalid',
      VITO_API_TOKEN: 'local-placeholder-token',
      VITO_PROBE_PATH: '/status',
    });

    assert.equal(result.ok, true);
    assert.equal(result.config.VITO_PROBE_TIMEOUT_MS, 5_000);
    assert.equal(result.safeConfig.VITO_API_TOKEN, '[redacted]');
  });

  it('uses a positive integer timeout override', () => {
    const result = validateProbeConfig({
      VITO_BASE_URL: 'https://vito.example.invalid',
      VITO_API_TOKEN: 'local-placeholder-token',
      VITO_PROBE_PATH: '/status',
      VITO_PROBE_TIMEOUT_MS: '2500',
    });

    assert.equal(result.ok, true);
    assert.equal(result.config.VITO_PROBE_TIMEOUT_MS, 2_500);
  });

  it('falls back to the safe default timeout for invalid override values', () => {
    const result = validateProbeConfig({
      VITO_BASE_URL: 'https://vito.example.invalid',
      VITO_API_TOKEN: 'local-placeholder-token',
      VITO_PROBE_PATH: '/status',
      VITO_PROBE_TIMEOUT_MS: '-1',
    });

    assert.equal(result.ok, true);
    assert.equal(result.config.VITO_PROBE_TIMEOUT_MS, 5_000);
  });
});

describe('parseDiscoveryPaths', () => {
  it('parses named and unnamed paths', () => {
    assert.deepEqual(parseDiscoveryPaths('customers:/api/customers, /api/gifts'), [
      {
        name: 'customers',
        path: '/api/customers',
      },
      {
        name: '/api/gifts',
        path: '/api/gifts',
      },
    ]);
  });
});

describe('validateDiscoveryConfig', () => {
  it('requires discovery paths in addition to foundation configuration', () => {
    const result = validateDiscoveryConfig({
      VITO_BASE_URL: 'https://vito.example.invalid',
      VITO_API_TOKEN: 'local-placeholder-token',
    });

    assert.equal(result.ok, false);
    assert.deepEqual(result.missing, ['VITO_DISCOVERY_PATHS']);
    assert.equal(getRequiredDiscoveryConfigKeys().includes('VITO_DISCOVERY_PATHS'), true);
  });

  it('returns parsed paths and safe timeout defaults', () => {
    const result = validateDiscoveryConfig({
      VITO_BASE_URL: 'https://vito.example.invalid',
      VITO_API_TOKEN: 'local-placeholder-token',
      VITO_DISCOVERY_PATHS: 'customers:/api/customers, gifts:/api/gifts',
    });

    assert.equal(result.ok, true);
    assert.deepEqual(result.config.VITO_DISCOVERY_PATHS, [
      {
        name: 'customers',
        path: '/api/customers',
      },
      {
        name: 'gifts',
        path: '/api/gifts',
      },
    ]);
    assert.equal(result.config.VITO_DISCOVERY_TIMEOUT_MS, 5_000);
    assert.equal(result.safeConfig.VITO_API_TOKEN, '[redacted]');
  });

  it('uses a positive integer discovery timeout override', () => {
    const result = validateDiscoveryConfig({
      VITO_BASE_URL: 'https://vito.example.invalid',
      VITO_API_TOKEN: 'local-placeholder-token',
      VITO_DISCOVERY_PATHS: 'customers:/api/customers',
      VITO_DISCOVERY_TIMEOUT_MS: '3000',
    });

    assert.equal(result.ok, true);
    assert.equal(result.config.VITO_DISCOVERY_TIMEOUT_MS, 3_000);
  });
});
