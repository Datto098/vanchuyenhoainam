export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number | null,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}
