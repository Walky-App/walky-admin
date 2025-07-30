/* eslint-disable @typescript-eslint/ban-ts-comment */
import "@testing-library/jest-dom";
// @ts-expect-error
import { TextEncoder, TextDecoder } from "util";

if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}
