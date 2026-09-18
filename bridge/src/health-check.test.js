import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { runBridgeHealthCheck } from './health-check.js';

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

describe('runBridgeHealthCheck', () => {
  it('prints a ready result and explicitly avoids synchronization', () => {
    const { output, lines } = createOutputRecorder();
    const result = runBridgeHealthCheck(
      {
        VITO_BASE_URL: 'https://vito.example.invalid',
        VITO_API_TOKEN: 'local-placeholder-token',
      },
      output,
    );

    assert.deepEqual(result, {
      ok: true,
      exitCode: 0,
    });
    assert.equal(lines.includes('VITO bridge foundation ready.'), true);
    assert.equal(
      lines.includes('No VITO API calls or data synchronization were performed.'),
      true,
    );
  });

  it('fails clearly when required configuration is missing', () => {
    const { output, lines } = createOutputRecorder();
    const result = runBridgeHealthCheck({}, output);

    assert.equal(result.ok, false);
    assert.equal(result.exitCode, 1);
    assert.deepEqual(result.missing, ['VITO_BASE_URL', 'VITO_API_TOKEN']);
    assert.match(lines.join('\n'), /VITO_BASE_URL/);
    assert.match(lines.join('\n'), /VITO_API_TOKEN/);
  });

  it('does not call fetch or any injected network primitive', () => {
    const originalFetch = globalThis.fetch;
    let fetchCalled = false;
    globalThis.fetch = () => {
      fetchCalled = true;
      throw new Error('Network calls are not allowed in the bridge foundation check.');
    };

    try {
      const { output } = createOutputRecorder();
      const result = runBridgeHealthCheck(
        {
          VITO_BASE_URL: 'https://vito.example.invalid',
          VITO_API_TOKEN: 'local-placeholder-token',
        },
        output,
      );

      assert.equal(result.ok, true);
      assert.equal(fetchCalled, false);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
