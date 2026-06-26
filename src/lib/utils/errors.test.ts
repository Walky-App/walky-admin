import { describe, it, expect } from "vitest";
import { AxiosError, AxiosHeaders } from "axios";
import { getErrorMessage, isApiError } from "./errors";

function makeAxiosError(data: unknown, message = "Request failed"): AxiosError {
  const err = new AxiosError(message);
  // Minimal response object; only `data` is read by the helper.
  err.response = {
    data,
    status: 400,
    statusText: "Bad Request",
    headers: {},
    config: { headers: new AxiosHeaders() },
  } as never;
  return err;
}

describe("getErrorMessage", () => {
  it("returns the string itself when given a string", () => {
    expect(getErrorMessage("boom")).toBe("boom");
  });

  it("falls back when given an empty string", () => {
    expect(getErrorMessage("", "fallback")).toBe("fallback");
  });

  it("reads `message` from an Axios error body", () => {
    const err = makeAxiosError({ message: "Email already in use" });
    expect(getErrorMessage(err)).toBe("Email already in use");
  });

  it("reads a string `error` field from an Axios error body", () => {
    const err = makeAxiosError({ error: "Invalid token" });
    expect(getErrorMessage(err)).toBe("Invalid token");
  });

  it("reads a nested `error.message` from an Axios error body", () => {
    const err = makeAxiosError({ error: { message: "Nested message" } });
    expect(getErrorMessage(err)).toBe("Nested message");
  });

  it("falls back to the Axios error message when the body has none", () => {
    const err = makeAxiosError({}, "Network Error");
    expect(getErrorMessage(err)).toBe("Network Error");
  });

  it("reads the message from a native Error", () => {
    expect(getErrorMessage(new Error("native boom"))).toBe("native boom");
  });

  it("reads a message from a plain thrown object", () => {
    expect(getErrorMessage({ message: "plain message" })).toBe("plain message");
    expect(getErrorMessage({ error: { message: "nested plain" } })).toBe(
      "nested plain",
    );
  });

  it("returns the fallback for unknown values", () => {
    expect(getErrorMessage(undefined, "fallback")).toBe("fallback");
    expect(getErrorMessage({ weird: true }, "fallback")).toBe("fallback");
  });

  it("uses the default fallback when none is provided", () => {
    expect(getErrorMessage(null)).toBe("Something went wrong");
  });
});

describe("isApiError", () => {
  it("is true for Axios errors", () => {
    expect(isApiError(makeAxiosError({ message: "x" }))).toBe(true);
  });

  it("is false for native errors and plain objects", () => {
    expect(isApiError(new Error("x"))).toBe(false);
    expect(isApiError({ response: { data: {} } })).toBe(false);
  });
});
