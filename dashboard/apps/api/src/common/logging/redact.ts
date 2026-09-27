const REDACTED = '[REDACTED]';
const SENSITIVE_KEY =
  /authorization|cookie|token|secret|password|(?:api|ai)[-_]?key|client[-_]?secret|email|phone|address/i;

export function redactLogValue(value: unknown, seen = new WeakSet<object>()): unknown {
  if (Array.isArray(value)) return value.map((item) => redactLogValue(item, seen));
  if (!value || typeof value !== 'object') return value;
  if (value instanceof Error)
    return { name: value.name, message: value.message, stack: value.stack };
  if (seen.has(value)) return '[Circular]';

  seen.add(value);
  const result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    result[key] = SENSITIVE_KEY.test(key) ? REDACTED : redactLogValue(item, seen);
  }
  return result;
}
