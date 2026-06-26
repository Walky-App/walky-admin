import axios from "axios";

/**
 * Shape of error response bodies returned by the Walky backend. The backend is
 * inconsistent about where the message lives (`message`, `error`, or a nested
 * `error.message`), so all known shapes are optional here.
 */
export interface ApiErrorBody {
  message?: string;
  error?: string | { message?: string };
  status?: string;
}

/**
 * Type guard for Axios errors carrying a backend error body. Prefer this over
 * `error as AxiosError` casts so the response shape stays type-checked.
 */
export function isApiError(
  err: unknown,
): err is import("axios").AxiosError<ApiErrorBody> {
  return axios.isAxiosError<ApiErrorBody>(err);
}

/** Pull a message out of an error body shaped like `{ message }` / `{ error }`. */
function messageFromBody(body: ApiErrorBody | undefined): string | undefined {
  if (!body) return undefined;
  const nested = typeof body.error === "object" ? body.error?.message : body.error;
  return body.message || nested || undefined;
}

/**
 * Extract a human-readable message from an unknown thrown value.
 *
 * Handles Axios errors (with the backend's varied error-body shapes), native
 * `Error` instances, plain strings, and plain thrown objects (some services
 * throw the parsed response body directly), falling back to `fallback`
 * otherwise. Replaces the repeated
 * `catch (err: any) { err?.response?.data?.message }` pattern with a single
 * type-safe path.
 */
export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong",
): string {
  if (typeof err === "string") return err || fallback;

  if (isApiError(err)) {
    return messageFromBody(err.response?.data) || err.message || fallback;
  }

  if (err instanceof Error) return err.message || fallback;

  if (err && typeof err === "object") {
    return messageFromBody(err as ApiErrorBody) || fallback;
  }

  return fallback;
}
