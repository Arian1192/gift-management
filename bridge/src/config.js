const REQUIRED_CONFIG = [
  {
    name: 'VITO_BASE_URL',
    secret: false,
  },
  {
    name: 'VITO_API_TOKEN',
    secret: true,
  },
];

function normalizeValue(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function getRequiredConfigKeys() {
  return REQUIRED_CONFIG.map(({ name }) => name);
}

export function validateBridgeConfig(env = process.env) {
  const missing = REQUIRED_CONFIG.filter(({ name }) => normalizeValue(env[name]) === '').map(
    ({ name }) => name,
  );

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
