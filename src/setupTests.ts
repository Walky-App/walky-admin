/* eslint-disable @typescript-eslint/ban-ts-comment */
import "@testing-library/jest-dom";
// @ts-ignore
import { TextEncoder, TextDecoder } from "util";

// Ensure React is available globally
import React from "react";
// @ts-ignore
globalThis.React = React;
// @ts-ignore
global.React = React;

if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}

// Mock localStorage
const localStorageState: { [key: string]: string } = {};
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn((key: string) => {
      console.log(`localStorage.getItem called with key: ${key}, returning: ${localStorageState[key] || null}`);
      return localStorageState[key] || null;
    }),
    setItem: jest.fn((key: string, value: string) => {
      console.log(`localStorage.setItem called with key: ${key}, value: ${value}`);
      localStorageState[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      console.log(`localStorage.removeItem called with key: ${key}`);
      delete localStorageState[key];
    }),
    clear: jest.fn(() => {
      console.log(`localStorage.clear called`);
      Object.keys(localStorageState).forEach(key => delete localStorageState[key]);
    }),
  },
  writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
