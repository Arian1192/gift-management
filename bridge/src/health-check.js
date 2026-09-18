import { validateBridgeConfig } from './config.js';

export function runBridgeHealthCheck(env = process.env, output = console) {
  const result = validateBridgeConfig(env);

  if (!result.ok) {
    output.error(`VITO bridge foundation check failed: ${result.message}`);
    return {
      ok: false,
      exitCode: 1,
      missing: result.missing,
    };
  }

  output.log('VITO bridge foundation ready.');
  output.log(`Configured endpoint: ${result.config.VITO_BASE_URL}`);
  output.log('No VITO API calls or data synchronization were performed.');

  return {
    ok: true,
    exitCode: 0,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = runBridgeHealthCheck();
  process.exitCode = result.exitCode;
}
