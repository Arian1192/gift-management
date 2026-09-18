import { validateProbeConfig } from './config.js';

function buildProbeUrl(baseUrl, probePath) {
  const normalizedPath = probePath.startsWith('/') ? probePath.slice(1) : probePath;
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  return new URL(normalizedPath, normalizedBase).toString();
}

function createTimeoutController(timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeout),
  };
}

function isAbortError(error) {
  return error?.name === 'AbortError';
}

function result(status, message, details = {}) {
  return {
    ok: status === 'success',
    status,
    message,
    ...details,
  };
}

export function createProbeRequest(config) {
  return {
    url: buildProbeUrl(config.VITO_BASE_URL, config.VITO_PROBE_PATH),
    init: {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${config.VITO_API_TOKEN}`,
      },
    },
    safe: {
      method: 'GET',
      authorization: '[redacted]',
    },
  };
}

export async function probeVitoConnection({
  env = process.env,
  fetchImpl = globalThis.fetch,
} = {}) {
  const validation = validateProbeConfig(env);

  if (!validation.ok) {
    return result('missing_config', validation.message, {
      exitCode: 1,
      missing: validation.missing,
    });
  }

  const request = createProbeRequest(validation.config);
  const timeout = createTimeoutController(validation.config.VITO_PROBE_TIMEOUT_MS);

  try {
    const response = await fetchImpl(request.url, {
      ...request.init,
      signal: timeout.signal,
    });

    if (response.status === 401 || response.status === 403) {
      return result('auth_failed', 'VITO authentication failed for the configured probe.', {
        exitCode: 1,
        statusCode: response.status,
      });
    }

    if (!response.ok) {
      return result(
        'unexpected_response',
        `VITO probe returned an unexpected HTTP status: ${response.status}`,
        {
          exitCode: 1,
          statusCode: response.status,
        },
      );
    }

    return result('success', 'VITO connectivity is available.', {
      exitCode: 0,
      probeUrl: request.url,
      request: request.safe,
    });
  } catch (error) {
    if (isAbortError(error)) {
      return result('timeout', 'VITO probe timed out before receiving a response.', {
        exitCode: 1,
        timeoutMs: validation.config.VITO_PROBE_TIMEOUT_MS,
      });
    }

    return result('network_error', 'VITO probe could not reach the configured endpoint.', {
      exitCode: 1,
    });
  } finally {
    timeout.clear();
  }
}

export function printProbeResult(probeResult, output = console) {
  const write = probeResult.ok ? output.log : output.error;

  write(`VITO connection probe: ${probeResult.message}`);

  if (probeResult.status === 'success') {
    output.log(`Probe URL: ${probeResult.probeUrl}`);
    output.log('Authorization: [redacted]');
    output.log('No VITO response payload was printed or persisted.');
    output.log('No Gift Management or VITO domain data was synchronized.');
    return;
  }

  if (probeResult.missing?.length > 0) {
    output.error(`Missing configuration: ${probeResult.missing.join(', ')}`);
  }

  if (probeResult.statusCode) {
    output.error(`HTTP status: ${probeResult.statusCode}`);
  }

  if (probeResult.timeoutMs) {
    output.error(`Timeout: ${probeResult.timeoutMs}ms`);
  }
}

export async function runVitoConnectionProbe(env = process.env, output = console) {
  const probeResult = await probeVitoConnection({ env });
  printProbeResult(probeResult, output);

  return probeResult;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const probeResult = await runVitoConnectionProbe();
  process.exitCode = probeResult.exitCode;
}
