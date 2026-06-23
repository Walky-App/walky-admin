/* eslint-disable react-refresh/only-export-components */
import { ReactElement, ReactNode } from "react";
import {
  render,
  renderHook,
  type RenderOptions,
  type RenderHookOptions,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

import { ThemeProvider } from "../contexts/ThemeProvider";
import { SchoolProvider } from "../contexts/SchoolContext";
import { CampusProvider } from "../contexts/CampusContext";
import { DashboardProvider } from "../contexts/DashboardContext";
import { DeactivatedUserProvider } from "../contexts/DeactivatedUserContext";

/**
 * Test rendering utilities.
 *
 * `renderWithProviders` mounts a component inside the same provider stack the
 * real app uses (React Query, Theme, School, Campus, Dashboard, DeactivatedUser
 * and a router) so components/hooks that read context don't blow up. Use it
 * instead of RTL's bare `render`.
 *
 *   const { getByRole } = renderWithProviders(<EventsManager />, {
 *     route: "/events",
 *   });
 *
 * A FRESH QueryClient is created per render (retries disabled) so cache never
 * leaks between tests. The created client is returned so a test can seed or
 * inspect the cache:
 *
 *   const { queryClient } = renderWithProviders(<Foo />);
 *   queryClient.setQueryData(["x"], 1);
 */

/** A QueryClient tuned for tests: no retries, no background refetch noise. */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
      mutations: { retry: false },
    },
  });
}

interface ProviderOptions {
  /** Initial router entry, e.g. "/events". Defaults to "/". */
  route?: string;
  /** Provide a shared client across renders; defaults to a fresh one. */
  queryClient?: QueryClient;
}

function AllProviders({
  children,
  route = "/",
  queryClient,
}: ProviderOptions & { children: ReactNode }) {
  const client = queryClient ?? createTestQueryClient();
  return (
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[route]}>
        <ThemeProvider>
          <DeactivatedUserProvider>
            <SchoolProvider>
              <CampusProvider>
                <DashboardProvider>{children}</DashboardProvider>
              </CampusProvider>
            </SchoolProvider>
          </DeactivatedUserProvider>
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options: ProviderOptions & Omit<RenderOptions, "wrapper"> = {}
) {
  const { route, queryClient, ...renderOptions } = options;
  const client = queryClient ?? createTestQueryClient();
  const result = render(ui, {
    wrapper: ({ children }) => (
      <AllProviders route={route} queryClient={client}>
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  });
  return { ...result, queryClient: client, user: userEvent.setup() };
}

export function renderHookWithProviders<Result, Props>(
  hook: (initialProps: Props) => Result,
  options: ProviderOptions & Omit<RenderHookOptions<Props>, "wrapper"> = {}
) {
  const { route, queryClient, ...hookOptions } = options;
  const client = queryClient ?? createTestQueryClient();
  const result = renderHook(hook, {
    wrapper: ({ children }) => (
      <AllProviders route={route} queryClient={client}>
        {children}
      </AllProviders>
    ),
    ...hookOptions,
  });
  return { ...result, queryClient: client };
}

// Re-export the testing-library surface so tests have a single import source.
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
