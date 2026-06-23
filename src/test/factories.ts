import type { Campus } from "../contexts/CampusContext";
import type { School } from "../services/schoolService";

/**
 * Test data builders.
 *
 * Each factory returns a realistic default object and accepts a partial
 * `overrides` so a test only spells out the fields it cares about:
 *
 *   const user = mockUser({ role: "moderator" });
 *   const page2 = mockPagination({ page: 2, total: 57 });
 *
 * Keep these decoupled from the generated API types on purpose — they model the
 * shapes the UI actually consumes, which are often looser than the swagger
 * types. Tighten/extend as real components start depending on more fields.
 */

export interface MockUser {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  school_id?: string;
  campus_id?: string;
  avatar_url?: string;
  require_password_change?: boolean;
  is_active?: boolean;
}

let seq = 0;
/** Deterministic incrementing id suffix (no Math.random — keeps tests stable). */
const nextId = (prefix: string) => `${prefix}-${++seq}`;

export const mockUser = (overrides: Partial<MockUser> = {}): MockUser => ({
  _id: nextId("user"),
  email: "admin@walky.test",
  first_name: "Test",
  last_name: "Admin",
  role: "super_admin",
  is_active: true,
  require_password_change: false,
  ...overrides,
});

export const mockSchool = (overrides: Partial<School> = {}): School =>
  ({
    id: nextId("school"),
    _id: nextId("school"),
    name: "Test University",
    school_name: "Test University",
    ...overrides,
  } as School);

export const mockCampus = (overrides: Partial<Campus> = {}): Campus => ({
  id: nextId("campus"),
  _id: nextId("campus"),
  name: "Main Campus",
  campus_name: "Main Campus",
  school_id: { _id: "school-1", school_name: "Test University" },
  ...overrides,
});

export interface MockPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export const mockPagination = (
  overrides: Partial<MockPagination> = {}
): MockPagination => {
  const page = overrides.page ?? 1;
  const limit = overrides.limit ?? 20;
  const total = overrides.total ?? 0;
  return {
    page,
    limit,
    total,
    pages: overrides.pages ?? Math.max(1, Math.ceil(total / limit)),
  };
};

export interface MockEvent {
  _id: string;
  event_name: string;
  start_date: string;
  end_date: string;
  event_type: "public" | "private";
  attendees_count: number;
  is_flagged: boolean;
  flag_reason?: string;
}

export const mockEvent = (overrides: Partial<MockEvent> = {}): MockEvent => ({
  _id: nextId("event"),
  event_name: "Welcome Mixer",
  start_date: "2026-01-15T18:00:00.000Z",
  end_date: "2026-01-15T20:00:00.000Z",
  event_type: "public",
  attendees_count: 12,
  is_flagged: false,
  ...overrides,
});

export interface MockReport {
  _id: string;
  report_type: string;
  reason: string;
  status: "pending" | "under_review" | "resolved" | "dismissed";
  description?: string;
  created_at: string;
}

export const mockReport = (overrides: Partial<MockReport> = {}): MockReport => ({
  _id: nextId("report"),
  report_type: "user",
  reason: "harassment",
  status: "pending",
  description: "Reported for harassment.",
  created_at: "2026-01-10T12:00:00.000Z",
  ...overrides,
});

/** Resets the id sequence — call in a beforeEach if a test asserts exact ids. */
export const resetFactorySequence = () => {
  seq = 0;
};
