/* eslint-disable no-console -- this module is the single sanctioned console wrapper */

/**
 * Lightweight application logger.
 *
 * `debug`/`info` are emitted only in development builds so we never leak API
 * payloads (which can include user PII) or noisy diagnostics into an end-user's
 * browser console in production. `warn`/`error` are always emitted so genuine
 * problems remain visible for support and error tracking.
 *
 * Usage:
 *   import { logger } from "../lib/logger";
 *   logger.debug("Fetching reports", filters);
 *   logger.error("Failed to fetch reports", error);
 */

type LogFn = (...args: unknown[]) => void;

const isDev: boolean = import.meta.env.DEV;

const noop: LogFn = () => {};

export interface Logger {
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  error: LogFn;
}

export const logger: Logger = {
  debug: isDev ? console.debug.bind(console) : noop,
  info: isDev ? console.info.bind(console) : noop,
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};
