import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createProbeRequest, printProbeResult, probeVitoConnection } from './probe.js';

const validEnv = {
  VITO_BASE_URL: 'https://vito.example.invalid',
  VITO_API_TOKEN: 'super-secret-token',
  VITO_PROBE_PATH: '/status',
  VITO_PROBE_TIMEOUT_MS: '1000',
};

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

describe('createProbeRequest', () => {
  it('builds the configured probe URL and redacts authorization in safe output', () => {
    const request = createProbeRequest({
      VITO_BASE_URL: 'https://vito.example.invalid/api',
      VITO_API_TOKEN: 'super-secret-token',
      VITO_PROBE_PATH: '/status',
    });

    assert.equal(request.url, 'https://vito.example.invalid/api/status');
    assert.equal(request.init.headers.Authorization, 'Bearer super-secret-token');
    assert.deepEqual(request.safe, {
      method: 'GET',
      authorization: '[redacted]',
    });
    assert.equal(stringify(request.safe).includes('super-secret-token'), false);
  });
});

describe('probeVitoConnection', () => {
  it('fails before making a network request when probe config is missing', async () => {
    let fetchCalled = false;
    const result = await probeVitoConnection({
      env: {},
      fetchImpl: async () => {
        fetchCalled = true;
        return { ok: true, status: 200 };
      },
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, 'missing_config');
    assert.deepEqual(result.missing, ['VITO_BASE_URL', 'VITO_API_TOKEN', 'VITO_PROBE_PATH']);
    assert.equal(fetchCalled, false);
  });

  it('reports success without dumping response payload or token', async () => {
    const result = await probeVitoConnection({
      env: validEnv,
      fetchImpl: async (url, init) => {
        assert.equal(url, 'https://vito.example.invalid/status');
        assert.equal(init.method, 'GET');
        assert.equal(init.headers.Authorization, 'Bearer super-secret-token');
        return {
          ok: true,
          status: 200,
          json: async () => ({ private: 'payload' }),
          text: async () => 'private payload',
        };
      },
    });

    assert.equal(result.ok, true);
    assert.equal(result.status, 'success');
    assert.equal(stringify(result).includes('super-secret-token'), false);
    assert.equal(stringify(result).includes('private payload'), false);
  });

  it('classifies authentication failures without printing the token', async () => {
    const result = await probeVitoConnection({
      env: validEnv,
      fetchImpl: async () => ({ ok: false, status: 401 }),
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, 'auth_failed');
    assert.equal(result.statusCode, 401);
    assert.equal(stringify(result).includes('super-secret-token'), false);
  });

  it('classifies unexpected non-success responses without dumping response body', async () => {
    const result = await probeVitoConnection({
      env: validEnv,
      fetchImpl: async () => ({
        ok: false,
        status: 500,
        text: async () => 'private server body',
      }),
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, 'unexpected_response');
    assert.equal(result.statusCode, 500);
    assert.equal(stringify(result).includes('private server body'), false);
  });

  it('classifies network errors', async () => {
    const result = await probeVitoConnection({
      env: validEnv,
      fetchImpl: async () => {
        throw new TypeError('getaddrinfo ENOTFOUND vito.internal');
      },
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, 'network_error');
    assert.equal(stringify(result).includes('vito.internal'), false);
  });

  it('classifies timeouts', async () => {
    const result = await probeVitoConnection({
      env: validEnv,
      fetchImpl: async () => {
        const error = new Error('operation aborted');
        error.name = 'AbortError';
        throw error;
      },
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, 'timeout');
    assert.equal(result.timeoutMs, 1_000);
  });
});

describe('printProbeResult', () => {
  it('prints safe success output only', () => {
    const { output, lines } = createOutputRecorder();

    printProbeResult(
      {
        ok: true,
        status: 'success',
        message: 'VITO connectivity is available.',
        probeUrl: 'https://vito.example.invalid/status',
        request: {
          authorization: '[redacted]',
        },
      },
      output,
    );

    const outputText = lines.join('\n');
    assert.match(outputText, /VITO connectivity is available/);
    assert.match(outputText, /Authorization: \[redacted\]/);
    assert.match(outputText, /No VITO response payload/);
    assert.match(outputText, /No Gift Management or VITO domain data/);
    assert.equal(outputText.includes('super-secret-token'), false);
  });
});
