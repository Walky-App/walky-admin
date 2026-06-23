import { describe, it, expect } from "vitest";
import {
  permissionMatrix,
  getPermissions,
  hasPermission,
  getResourceFromRoute,
  canAccessRoute,
  routeResourceMap,
  getAssignableRoles,
  getAssignableRoleDisplayNames,
  canAssignRole,
  canAssignRoleByDisplayName,
  roleDisplayNameMap,
  displayNameToRoleMap,
  type RoleName,
  type PermissionResource,
  type PermissionAction,
} from "./permissions";

const ROLES: RoleName[] = [
  "super_admin",
  "school_admin",
  "campus_admin",
  "moderator",
  "walky_internal",
];

const ACTIONS: PermissionAction[] = [
  "read",
  "create",
  "update",
  "delete",
  "export",
  "manage",
];

const RESOURCES = Object.keys(
  permissionMatrix.super_admin
) as PermissionResource[];

describe("permissions matrix wiring", () => {
  // Guards the helper functions against regressions: every helper must read
  // exactly what the matrix declares, for all 5 roles × every resource × 6
  // actions.
  it.each(ROLES)("getPermissions/hasPermission agree with the matrix for %s", (role) => {
    for (const resource of RESOURCES) {
      const expected = permissionMatrix[role][resource];
      expect(getPermissions(role, resource)).toEqual(expected);
      for (const action of ACTIONS) {
        expect(hasPermission(role, resource, action)).toBe(expected[action]);
      }
    }
  });

  it("returns no permissions for an unknown role", () => {
    expect(getPermissions("intruder", "engagement")).toEqual({
      read: false,
      create: false,
      update: false,
      delete: false,
      export: false,
      manage: false,
    });
    expect(hasPermission("intruder", "role_management", "manage")).toBe(false);
  });

  it("covers every resource for every role (no holes in the matrix)", () => {
    for (const role of ROLES) {
      for (const resource of RESOURCES) {
        expect(permissionMatrix[role][resource]).toBeDefined();
      }
    }
  });
});

describe("permission business rules", () => {
  it("grants super_admin full control of role management and ambassadors", () => {
    expect(hasPermission("super_admin", "role_management", "manage")).toBe(true);
    expect(hasPermission("super_admin", "role_management", "create")).toBe(true);
    expect(hasPermission("super_admin", "role_management", "delete")).toBe(true);
    expect(hasPermission("super_admin", "ambassadors", "create")).toBe(true);
    expect(hasPermission("super_admin", "ambassadors", "delete")).toBe(true);
    // Ambassadors are create/read/delete only — no update.
    expect(hasPermission("super_admin", "ambassadors", "update")).toBe(false);
    // Campuses are read/update only — never delete.
    expect(hasPermission("super_admin", "campuses", "update")).toBe(true);
    expect(hasPermission("super_admin", "campuses", "delete")).toBe(false);
  });

  it("limits moderators to read-only dashboards and report moderation power", () => {
    expect(hasPermission("moderator", "report_safety", "read")).toBe(true);
    expect(hasPermission("moderator", "report_safety", "update")).toBe(true);
    expect(hasPermission("moderator", "report_safety", "export")).toBe(true);
    expect(hasPermission("moderator", "report_safety", "delete")).toBe(false);
    expect(hasPermission("moderator", "report_safety", "manage")).toBe(false);
    // No student management, no admin.
    expect(hasPermission("moderator", "active_students", "read")).toBe(false);
    expect(hasPermission("moderator", "campuses", "read")).toBe(false);
    expect(hasPermission("moderator", "role_management", "read")).toBe(false);
    // Dashboards: read but never export.
    expect(hasPermission("moderator", "engagement", "read")).toBe(true);
    expect(hasPermission("moderator", "engagement", "export")).toBe(false);
  });

  it("keeps walky_internal strictly read-only with no moderation access", () => {
    for (const resource of RESOURCES) {
      expect(hasPermission("walky_internal", resource, "create")).toBe(false);
      expect(hasPermission("walky_internal", resource, "update")).toBe(false);
      expect(hasPermission("walky_internal", resource, "delete")).toBe(false);
      expect(hasPermission("walky_internal", resource, "export")).toBe(false);
      expect(hasPermission("walky_internal", resource, "manage")).toBe(false);
    }
    expect(hasPermission("walky_internal", "report_safety", "read")).toBe(false);
    expect(hasPermission("walky_internal", "report_history", "read")).toBe(false);
    expect(hasPermission("walky_internal", "campuses", "read")).toBe(true);
    expect(hasPermission("walky_internal", "engagement", "read")).toBe(true);
  });

  it("treats school_admin and campus_admin like super_admin for content", () => {
    for (const role of ["school_admin", "campus_admin"] as RoleName[]) {
      expect(hasPermission(role, "events_manager", "delete")).toBe(true);
      expect(hasPermission(role, "role_management", "manage")).toBe(true);
      expect(hasPermission(role, "active_students", "update")).toBe(true);
      expect(hasPermission(role, "disengaged_students", "update")).toBe(false);
    }
  });
});

describe("route → resource mapping", () => {
  it("resolves every declared route to its resource", () => {
    for (const [path, resource] of Object.entries(routeResourceMap)) {
      expect(getResourceFromRoute(path)).toBe(resource);
    }
  });

  it("returns null for unmapped routes", () => {
    expect(getResourceFromRoute("/totally/unknown")).toBeNull();
  });

  it("allows access to unmapped routes by default", () => {
    expect(canAccessRoute("moderator", "/admin/settings")).toBe(true);
  });

  it("gates mapped routes by the read permission", () => {
    expect(canAccessRoute("moderator", "/admin/campuses")).toBe(false);
    expect(canAccessRoute("moderator", "/report-safety")).toBe(true);
    expect(canAccessRoute("walky_internal", "/report-safety")).toBe(false);
    expect(canAccessRoute("super_admin", "/admin/role-management")).toBe(true);
  });
});

describe("role assignment hierarchy", () => {
  it("returns the correct assignable roles per role", () => {
    expect(getAssignableRoles("super_admin")).toEqual([
      "school_admin",
      "campus_admin",
      "moderator",
    ]);
    expect(getAssignableRoles("school_admin")).toEqual([
      "campus_admin",
      "moderator",
    ]);
    expect(getAssignableRoles("campus_admin")).toEqual(["moderator"]);
    expect(getAssignableRoles("moderator")).toEqual([]);
    expect(getAssignableRoles("walky_internal")).toEqual([]);
    expect(getAssignableRoles("unknown_role")).toEqual([]);
  });

  it("maps assignable roles to display names", () => {
    expect(getAssignableRoleDisplayNames("super_admin")).toEqual([
      "School Admin",
      "Campus Admin",
      "Moderator",
    ]);
  });

  it("checks canAssignRole by internal name", () => {
    expect(canAssignRole("super_admin", "school_admin")).toBe(true);
    expect(canAssignRole("campus_admin", "moderator")).toBe(true);
    expect(canAssignRole("campus_admin", "school_admin")).toBe(false);
    // No one can assign super_admin, and moderators can assign no one.
    expect(canAssignRole("super_admin", "super_admin")).toBe(false);
    expect(canAssignRole("moderator", "moderator")).toBe(false);
  });

  it("checks canAssignRoleByDisplayName", () => {
    expect(canAssignRoleByDisplayName("super_admin", "School Admin")).toBe(true);
    expect(canAssignRoleByDisplayName("school_admin", "Campus Admin")).toBe(true);
    // 'Walky Admin' resolves to super_admin which is not assignable.
    expect(canAssignRoleByDisplayName("super_admin", "Walky Admin")).toBe(false);
    // Unknown display names short-circuit to false.
    expect(canAssignRoleByDisplayName("super_admin", "Emperor")).toBe(false);
  });
});

describe("role display-name maps", () => {
  it("are bidirectionally consistent", () => {
    for (const role of ROLES) {
      const display = roleDisplayNameMap[role];
      expect(displayNameToRoleMap[display]).toBe(role);
    }
  });
});
