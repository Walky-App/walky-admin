import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuth } from "./useAuth";
import { usePermissions } from "./usePermissions";
import {
  permissionMatrix,
  type PermissionResource,
  type RoleName,
} from "../lib/permissions";

// usePermissions reads the current role from useAuth and delegates every check
// to the (separately tested) permissions matrix. We mock useAuth so we can
// drive each role through the hook and assert it threads the role correctly —
// this is the authorization surface that gates the whole admin UI.
vi.mock("./useAuth");

const ROLES: RoleName[] = [
  "super_admin",
  "school_admin",
  "campus_admin",
  "moderator",
  "walky_internal",
];

const RESOURCES = Object.keys(
  permissionMatrix.super_admin,
) as PermissionResource[];

function setRole(role: string | null) {
  vi.mocked(useAuth).mockReturnValue({
    user: role ? { role } : null,
  } as unknown as ReturnType<typeof useAuth>);
}

beforeEach(() => {
  vi.mocked(useAuth).mockReset();
});

describe("usePermissions", () => {
  it("threads each role through to the permission matrix for every resource", () => {
    for (const role of ROLES) {
      setRole(role);
      const { result } = renderHook(() => usePermissions());

      for (const resource of RESOURCES) {
        const expected = permissionMatrix[role][resource];
        expect(result.current.can(resource, "read")).toBe(expected.read);
        expect(result.current.canRead(resource)).toBe(expected.read);
        expect(result.current.canCreate(resource)).toBe(expected.create);
        expect(result.current.canUpdate(resource)).toBe(expected.update);
        expect(result.current.canDelete(resource)).toBe(expected.delete);
        expect(result.current.canExport(resource)).toBe(expected.export);
        expect(result.current.canManage(resource)).toBe(expected.manage);
        expect(result.current.getResourcePermissions(resource)).toEqual(
          expected,
        );
      }

      expect(result.current.userRole).toBe(role);
    }
  });

  it("exposes correct role flags for super_admin", () => {
    setRole("super_admin");
    const { result } = renderHook(() => usePermissions());
    expect(result.current.isSuperAdmin).toBe(true);
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isSchoolAdmin).toBe(false);
    expect(result.current.isModerator).toBe(false);
    expect(result.current.isWalkyInternal).toBe(false);
  });

  it("treats school_admin and campus_admin as admins but not super", () => {
    for (const role of ["school_admin", "campus_admin"] as const) {
      setRole(role);
      const { result } = renderHook(() => usePermissions());
      expect(result.current.isAdmin).toBe(true);
      expect(result.current.isSuperAdmin).toBe(false);
    }
  });

  it("does not treat moderator or walky_internal as admins", () => {
    for (const role of ["moderator", "walky_internal"] as const) {
      setRole(role);
      const { result } = renderHook(() => usePermissions());
      expect(result.current.isAdmin).toBe(false);
    }

    setRole("moderator");
    expect(renderHook(() => usePermissions()).result.current.isModerator).toBe(
      true,
    );
    setRole("walky_internal");
    expect(
      renderHook(() => usePermissions()).result.current.isWalkyInternal,
    ).toBe(true);
  });

  it("denies all permissions and clears flags when no user is authenticated", () => {
    setRole(null);
    const { result } = renderHook(() => usePermissions());

    expect(result.current.userRole).toBe("");
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isSuperAdmin).toBe(false);

    for (const resource of RESOURCES) {
      expect(result.current.canRead(resource)).toBe(false);
      expect(result.current.canManage(resource)).toBe(false);
    }
  });

  it("delegates route access checks to the role", () => {
    setRole("super_admin");
    const superResult = renderHook(() => usePermissions()).result;
    setRole(null);
    const anonResult = renderHook(() => usePermissions()).result;

    // A mapped route gates on the resource's `read` permission for that role.
    const mappedRoute = "/dashboard/engagement";
    expect(superResult.current.canAccessPath(mappedRoute)).toBe(
      permissionMatrix.super_admin.engagement.read,
    );
    expect(anonResult.current.canAccessPath(mappedRoute)).toBe(false);

    // Unmapped routes are allowed by default for everyone.
    expect(anonResult.current.canAccessPath("/some/unmapped/route")).toBe(true);
  });
});
