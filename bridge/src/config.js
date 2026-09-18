const FOUNDATION_CONFIG = [
  {
    name: 'VITO_BASE_URL',
    secret: false,
  },
  {
    name: 'VITO_API_TOKEN',
    secret: true,
  },
];

const PROBE_CONFIG = [
  ...FOUNDATION_CONFIG,
  {
    name: 'VITO_PROBE_PATH',
    secret: false,
  },
];

const DEFAULT_PROBE_TIMEOUT_MS = 5_000;

function normalizeValue(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function findMissingConfig(requiredConfig, env) {
  return requiredConfig.filter(({ name }) => normalizeValue(env[name]) === '').map(({ name }) => name);
}

function parseProbeTimeout(value) {
  const normalized = normalizeValue(value);

  if (normalized === '') {
    return DEFAULT_PROBE_TIMEOUT_MS;
  }

  const parsed = Number(normalized);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return DEFAULT_PROBE_TIMEOUT_MS;
  }

  return parsed;
}

export function getRequiredConfigKeys() {
  return FOUNDATION_CONFIG.map(({ name }) => name);
}

export function getRequiredProbeConfigKeys() {
  return PROBE_CONFIG.map(({ name }) => name);
}

export function validateBridgeConfig(env = process.env) {
  const missing = findMissingConfig(FOUNDATION_CONFIG, env);

  if (missing.length > 0) {
    return {
      ok: false,
      missing,
      message: `Missing required VITO bridge configuration: ${missing.join(', ')}`,
    };
  }

  return {
    ok: true,
    config: {
      VITO_BASE_URL: normalizeValue(env.VITO_BASE_URL),
      VITO_API_TOKEN: '[redacted]',
    },
    message: 'VITO bridge foundation configuration is ready.',
  };
}

export function validateProbeConfig(env = process.env) {
  const missing = findMissingConfig(PROBE_CONFIG, env);

  if (missing.length > 0) {
    return {
      ok: false,
      missing,
      message: `Missing required VITO probe configuration: ${missing.join(', ')}`,
    };
  }

  return {
    ok: true,
    config: {
      VITO_BASE_URL: normalizeValue(env.VITO_BASE_URL),
      VITO_API_TOKEN: normalizeValue(env.VITO_API_TOKEN),
      VITO_PROBE_PATH: normalizeValue(env.VITO_PROBE_PATH),
      VITO_PROBE_TIMEOUT_MS: parseProbeTimeout(env.VITO_PROBE_TIMEOUT_MS),
    },
    safeConfig: {
      VITO_BASE_URL: normalizeValue(env.VITO_BASE_URL),
      VITO_API_TOKEN: '[redacted]',
      VITO_PROBE_PATH: normalizeValue(env.VITO_PROBE_PATH),
      VITO_PROBE_TIMEOUT_MS: parseProbeTimeout(env.VITO_PROBE_TIMEOUT_MS),
    },
    message: 'VITO probe configuration is ready.',
  };
}
