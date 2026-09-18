import { validateDiscoveryConfig } from './config.js';

function buildDiscoveryUrl(baseUrl, discoveryPath) {
  const normalizedPath = discoveryPath.startsWith('/') ? discoveryPath.slice(1) : discoveryPath;
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

function inferType(value) {
  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    return 'array';
  }

  return typeof value;
}

function mergeFieldType(existingType, nextType) {
  if (!existingType || existingType === nextType) {
    return nextType;
  }

  return Array.from(new Set(`${existingType}|${nextType}`.split('|'))).sort().join('|');
}

function summarizeObject(value) {
  return Object.keys(value)
    .sort()
    .map((name) => ({
      name,
      type: inferType(value[name]),
    }));
}

function summarizeArray(value) {
  const mergedFields = new Map();
  const itemTypes = new Set();

  for (const item of value) {
    const itemType = inferType(item);
    itemTypes.add(itemType);

    if (itemType !== 'object') {
      continue;
    }

    for (const field of summarizeObject(item)) {
      mergedFields.set(field.name, mergeFieldType(mergedFields.get(field.name), field.type));
    }
  }

  return {
    kind: 'array',
    itemCount: value.length,
    itemTypes: Array.from(itemTypes).sort(),
    fields: Array.from(mergedFields.entries())
      .map(([name, type]) => ({ name, type }))
      .sort((left, right) => left.name.localeCompare(right.name)),
  };
}

export function summarizeJsonShape(value) {
  if (Array.isArray(value)) {
    return summarizeArray(value);
  }

  if (value !== null && typeof value === 'object') {
    return {
      kind: 'object',
      fields: summarizeObject(value),
    };
  }

  return {
    kind: inferType(value),
  };
}

function result(status, message, details = {}) {
  return {
    ok: status === 'success',
    status,
    message,
    ...details,
  };
}

export function createDiscoveryRequest(config, resource) {
  return {
    name: resource.name,
    path: resource.path,
    url: buildDiscoveryUrl(config.VITO_BASE_URL, resource.path),
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

async function discoverResource({ config, resource, fetchImpl }) {
  const request = createDiscoveryRequest(config, resource);
  const timeout = createTimeoutController(config.VITO_DISCOVERY_TIMEOUT_MS);

  try {
    const response = await fetchImpl(request.url, {
      ...request.init,
      signal: timeout.signal,
    });

    if (response.status === 401 || response.status === 403) {
      return result('auth_failed', 'VITO authentication failed for this discovery resource.', {
        name: resource.name,
        path: resource.path,
        exitCode: 1,
        statusCode: response.status,
      });
    }

    if (!response.ok) {
      return result(
        'unexpected_response',
        `VITO discovery returned an unexpected HTTP status: ${response.status}`,
        {
          name: resource.name,
          path: resource.path,
          exitCode: 1,
          statusCode: response.status,
        },
      );
    }

    let payload;
    try {
      payload = await response.json();
    } catch (_error) {
      return result('unsupported_content', 'VITO discovery response could not be summarized as JSON.', {
        name: resource.name,
        path: resource.path,
        exitCode: 1,
      });
    }

    return result('success', 'VITO discovery shape summary is available.', {
      name: resource.name,
      path: resource.path,
      exitCode: 0,
      shape: summarizeJsonShape(payload),
      request: request.safe,
    });
  } catch (error) {
    if (isAbortError(error)) {
      return result('timeout', 'VITO discovery timed out before receiving a response.', {
        name: resource.name,
        path: resource.path,
        exitCode: 1,
        timeoutMs: config.VITO_DISCOVERY_TIMEOUT_MS,
      });
    }

    return result('network_error', 'VITO discovery could not reach this configured resource.', {
      name: resource.name,
      path: resource.path,
      exitCode: 1,
    });
  } finally {
    timeout.clear();
  }
}

export async function discoverVitoData({
  env = process.env,
  fetchImpl = globalThis.fetch,
} = {}) {
  const validation = validateDiscoveryConfig(env);

  if (!validation.ok) {
    return {
      ok: false,
      status: 'missing_config',
      message: validation.message,
      exitCode: 1,
      missing: validation.missing,
      results: [],
    };
  }

  const results = [];

  for (const resource of validation.config.VITO_DISCOVERY_PATHS) {
    results.push(await discoverResource({ config: validation.config, resource, fetchImpl }));
  }

  const ok = results.every((resourceResult) => resourceResult.ok);

  return {
    ok,
    status: ok ? 'success' : 'partial_failure',
    message: ok
      ? 'VITO data discovery completed successfully.'
      : 'VITO data discovery completed with one or more failed resources.',
    exitCode: ok ? 0 : 1,
    results,
  };
}

function formatFields(fields = []) {
  if (fields.length === 0) {
    return 'none';
  }

  return fields.map(({ name, type }) => `${name}:${type}`).join(', ');
}

function printShape(shape, output) {
  if (shape.kind === 'object') {
    output.log(`  shape: object fields=${formatFields(shape.fields)}`);
    return;
  }

  if (shape.kind === 'array') {
    output.log(`  shape: array itemCount=${shape.itemCount} itemTypes=${shape.itemTypes.join('|') || 'none'}`);
    output.log(`  item fields: ${formatFields(shape.fields)}`);
    return;
  }

  output.log(`  shape: ${shape.kind}`);
}

export function printDiscoveryResult(discoveryResult, output = console) {
  const write = discoveryResult.ok ? output.log : output.error;
  write(`VITO data discovery: ${discoveryResult.message}`);

  if (discoveryResult.missing?.length > 0) {
    output.error(`Missing configuration: ${discoveryResult.missing.join(', ')}`);
    return;
  }

  for (const resourceResult of discoveryResult.results) {
    const resourceWrite = resourceResult.ok ? output.log : output.error;
    resourceWrite(`- ${resourceResult.name} (${resourceResult.path}): ${resourceResult.status}`);

    if (resourceResult.shape) {
      printShape(resourceResult.shape, output);
      output.log('  values: [redacted]');
    }

    if (resourceResult.statusCode) {
      output.error(`  HTTP status: ${resourceResult.statusCode}`);
    }

    if (resourceResult.timeoutMs) {
      output.error(`  Timeout: ${resourceResult.timeoutMs}ms`);
    }
  }

  output.log('No VITO response payloads were printed or persisted.');
  output.log('No Gift Management or VITO domain data was synchronized.');
}

export async function runVitoDataDiscovery(env = process.env, output = console) {
  const discoveryResult = await discoverVitoData({ env });
  printDiscoveryResult(discoveryResult, output);

  return discoveryResult;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const discoveryResult = await runVitoDataDiscovery();
  process.exitCode = discoveryResult.exitCode;
}
