import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getRequiredConfigKeys, validateBridgeConfig } from './config.js';

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
