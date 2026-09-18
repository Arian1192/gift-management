import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  createDiscoveryRequest,
  discoverVitoData,
  printDiscoveryResult,
  summarizeJsonShape,
} from './discovery.js';

const validEnv = {
  VITO_BASE_URL: 'https://vito.example.invalid',
  VITO_API_TOKEN: 'super-secret-token',
  VITO_DISCOVERY_PATHS: 'customers:/api/customers,gifts:/api/gifts',
  VITO_DISCOVERY_TIMEOUT_MS: '1000',
};

function createJsonResponse(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
    text: async () => JSON.stringify(payload),
  };
}

function createOutputRecorder() {
  const lines = [];

  return {
    output: {
      log: (message) => lines.push(String(message)),
      error: (message) => lines.push(String(message)),
    },
    lines,
  };
}

function stringify(value) {
  return JSON.stringify(value);
}

describe('summarizeJsonShape', () => {
  it('summarizes object fields without values', () => {
    const shape = summarizeJsonShape({
      id: 'customer-1',
      active: true,
      tags: ['vip'],
      metadata: { tier: 'gold' },
      deletedAt: null,
    });

    assert.deepEqual(shape, {
      kind: 'object',
      fields: [
        { name: 'active', type: 'boolean' },
        { name: 'deletedAt', type: 'null' },
        { name: 'id', type: 'string' },
        { name: 'metadata', type: 'object' },
        { name: 'tags', type: 'array' },
      ],
    });
    assert.equal(stringify(shape).includes('customer-1'), false);
  });

  it('summarizes array item count and merged object item fields', () => {
    const shape = summarizeJsonShape([
      { id: '1', total: 12, enabled: true },
      { id: 2, name: 'Gift' },
    ]);

    assert.deepEqual(shape, {
      kind: 'array',
      itemCount: 2,
      itemTypes: ['object'],
      fields: [
        { name: 'enabled', type: 'boolean' },
        { name: 'id', type: 'number|string' },
        { name: 'name', type: 'string' },
        { name: 'total', type: 'number' },
      ],
    });
    assert.equal(stringify(shape).includes('Gift'), false);
  });
});

describe('createDiscoveryRequest', () => {
  it('builds the configured URL and redacts authorization in safe output', () => {
    const request = createDiscoveryRequest(
      {
        VITO_BASE_URL: 'https://vito.example.invalid/root',
        VITO_API_TOKEN: 'super-secret-token',
      },
      { name: 'customers', path: '/api/customers' },
    );

    assert.equal(request.url, 'https://vito.example.invalid/root/api/customers');
    assert.equal(request.init.headers.Authorization, 'Bearer super-secret-token');
    assert.deepEqual(request.safe, {
      method: 'GET',
      authorization: '[redacted]',
    });
    assert.equal(stringify(request.safe).includes('super-secret-token'), false);
  });
});

describe('discoverVitoData', () => {
  it('fails before discovery requests when required config is missing', async () => {
    let fetchCalled = false;
    const result = await discoverVitoData({
      env: {},
      fetchImpl: async () => {
        fetchCalled = true;
        return createJsonResponse({});
      },
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, 'missing_config');
    assert.deepEqual(result.missing, ['VITO_BASE_URL', 'VITO_API_TOKEN', 'VITO_DISCOVERY_PATHS']);
    assert.equal(fetchCalled, false);
  });

  it('returns one result per configured path and keeps going after a failure', async () => {
    const visitedUrls = [];
    const result = await discoverVitoData({
      env: validEnv,
      fetchImpl: async (url) => {
        visitedUrls.push(url);

        if (url.endsWith('/api/customers')) {
          return createJsonResponse([{ id: 'customer-1', email: 'private@example.invalid' }]);
        }

        return { ok: false, status: 500, json: async () => ({ private: true }) };
      },
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, 'partial_failure');
    assert.deepEqual(visitedUrls, [
      'https://vito.example.invalid/api/customers',
      'https://vito.example.invalid/api/gifts',
    ]);
    assert.equal(result.results[0].status, 'success');
    assert.equal(result.results[1].status, 'unexpected_response');
    assert.equal(stringify(result).includes('private@example.invalid'), false);
    assert.equal(stringify(result).includes('super-secret-token'), false);
  });

  it('classifies unsupported JSON content without dumping the body', async () => {
    const result = await discoverVitoData({
      env: {
        ...validEnv,
        VITO_DISCOVERY_PATHS: 'customers:/api/customers',
      },
      fetchImpl: async () => ({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError('not json');
        },
        text: async () => 'private body',
      }),
    });

    assert.equal(result.ok, false);
    assert.equal(result.results[0].status, 'unsupported_content');
    assert.equal(stringify(result).includes('private body'), false);
  });

  it('classifies auth, network, and timeout failures safely', async () => {
    const cases = [
      {
        expected: 'auth_failed',
        fetchImpl: async () => ({ ok: false, status: 403 }),
      },
      {
        expected: 'network_error',
        fetchImpl: async () => {
          throw new TypeError('ENOTFOUND private.host');
        },
      },
      {
        expected: 'timeout',
        fetchImpl: async () => {
          const error = new Error('aborted');
          error.name = 'AbortError';
          throw error;
        },
      },
    ];

    for (const { expected, fetchImpl } of cases) {
      const result = await discoverVitoData({
        env: {
          ...validEnv,
          VITO_DISCOVERY_PATHS: 'customers:/api/customers',
        },
        fetchImpl,
      });

      assert.equal(result.results[0].status, expected);
      assert.equal(stringify(result).includes('super-secret-token'), false);
      assert.equal(stringify(result).includes('private.host'), false);
    }
  });
});

describe('printDiscoveryResult', () => {
  it('prints safe shape output only', () => {
    const { output, lines } = createOutputRecorder();

    printDiscoveryResult(
      {
        ok: true,
        status: 'success',
        message: 'VITO data discovery completed successfully.',
        results: [
          {
            ok: true,
            status: 'success',
            name: 'customers',
            path: '/api/customers',
            shape: {
              kind: 'object',
              fields: [{ name: 'email', type: 'string' }],
            },
          },
        ],
      },
      output,
    );

    const outputText = lines.join('\n');
    assert.match(outputText, /customers/);
    assert.match(outputText, /email:string/);
    assert.match(outputText, /values: \[redacted\]/);
    assert.match(outputText, /No VITO response payloads/);
    assert.equal(outputText.includes('private@example.invalid'), false);
  });
});
