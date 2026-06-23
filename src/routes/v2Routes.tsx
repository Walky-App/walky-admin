import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LayoutV2 } from "../layout-v2";
import { CampusProvider } from "../contexts/CampusContext";
import { DashboardProvider } from "../contexts/DashboardContext";
import { PermissionGuard } from "../components-v2";

/**
 * Route-level code splitting: each page is lazy-loaded so the initial bundle
 * only contains the app shell. Named exports are unwrapped to a default for
 * React.lazy via `.then(m => ({ default: m.Name }))`.
 */

// Dashboard (default exports)
const DashboardEngagement = lazy(
  () => import("../pages-v2/Dashboard/Engagement/Engagement")
);
const DashboardPopularFeatures = lazy(
  () => import("../pages-v2/Dashboard/PopularFeatures/PopularFeatures")
);
const DashboardUserInteractions = lazy(
  () => import("../pages-v2/Dashboard/UserInteractions")
);
const DashboardCommunity = lazy(
  () => import("../pages-v2/Dashboard/Community")
);
const DashboardStudentSafety = lazy(
  () => import("../pages-v2/Dashboard/StudentSafety")
);
const DashboardStudentBehavior = lazy(
  () => import("../pages-v2/Dashboard/StudentBehavior")
);

// Campus (named exports)
const ActiveStudents = lazy(() =>
  import("../pages-v2/Campus/ActiveStudents").then((m) => ({
    default: m.ActiveStudents,
  }))
);
const BannedStudents = lazy(() =>
  import("../pages-v2/Campus/BannedStudents").then((m) => ({
    default: m.BannedStudents,
  }))
);
const DeactivatedStudents = lazy(() =>
  import("../pages-v2/Campus/DeactivatedStudents").then((m) => ({
    default: m.DeactivatedStudents,
  }))
);
const DisengagedStudents = lazy(() =>
  import("../pages-v2/Campus/DisengagedStudents").then((m) => ({
    default: m.DisengagedStudents,
  }))
);

// Events / Spaces / Ideas / Moderation / Admin (named exports from barrels)
const EventsManager = lazy(() =>
  import("../pages-v2/Events").then((m) => ({ default: m.EventsManager }))
);
const EventsInsights = lazy(() =>
  import("../pages-v2/Events").then((m) => ({ default: m.EventsInsights }))
);
const SpacesManager = lazy(() =>
  import("../pages-v2/Spaces").then((m) => ({ default: m.SpacesManager }))
);
const SpacesInsights = lazy(() =>
  import("../pages-v2/Spaces").then((m) => ({ default: m.SpacesInsights }))
);
const IdeasManager = lazy(() =>
  import("../pages-v2/Ideas").then((m) => ({ default: m.IdeasManager }))
);
const IdeasInsights = lazy(() =>
  import("../pages-v2/Ideas").then((m) => ({ default: m.IdeasInsights }))
);
const ReportSafety = lazy(() =>
  import("../pages-v2/Moderation").then((m) => ({ default: m.ReportSafety }))
);
const ReportHistory = lazy(() =>
  import("../pages-v2/Moderation").then((m) => ({ default: m.ReportHistory }))
);
const Campuses = lazy(() =>
  import("../pages-v2/Admin").then((m) => ({ default: m.Campuses }))
);
const Ambassadors = lazy(() =>
  import("../pages-v2/Admin").then((m) => ({ default: m.Ambassadors }))
);
const RoleManagement = lazy(() =>
  import("../pages-v2/Admin").then((m) => ({ default: m.RoleManagement }))
);
const AdministratorSettings = lazy(() =>
  import("../pages-v2/Admin").then((m) => ({
    default: m.AdministratorSettings,
  }))
);

// Playground (default exports) — heavy visualization experiments
const InterestCloud = lazy(
  () => import("../pages-v2/Playground/InterestCloud")
);
const InterestConstellation = lazy(
  () => import("../pages-v2/Playground/InterestConstellation")
);
const InterestChord = lazy(
  () => import("../pages-v2/Playground/InterestChord")
);
const InterestPyramid = lazy(
  () => import("../pages-v2/Playground/InterestPyramid")
);
const ActiveUsersSpiral = lazy(
  () => import("../pages-v2/Playground/ActiveUsersSpiral")
);
const ActiveUsersHeat = lazy(
  () => import("../pages-v2/Playground/ActiveUsersHeat")
);
const ActiveUsersRings = lazy(
  () => import("../pages-v2/Playground/ActiveUsersRings")
);
const ActiveUsersFunnel = lazy(
  () => import("../pages-v2/Playground/ActiveUsersFunnel")
);
const ActiveUsersGuitar = lazy(
  () => import("../pages-v2/Playground/ActiveUsersGuitar")
);
const ActiveUsersDrums = lazy(
  () => import("../pages-v2/Playground/ActiveUsersDrums")
);
const ActiveUsersChimes = lazy(
  () => import("../pages-v2/Playground/ActiveUsersChimes")
);
const ActiveUsersWaves = lazy(
  () => import("../pages-v2/Playground/ActiveUsersWaves")
);
const ActiveUsersOrbs = lazy(
  () => import("../pages-v2/Playground/ActiveUsersOrbs")
);
const ActiveUsersGalaxy = lazy(
  () => import("../pages-v2/Playground/ActiveUsersGalaxy")
);

const RouteFallback = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      width: "100%",
    }}
  >
    <div className="spinner-border text-primary" role="status" aria-label="Loading">
      <span className="visually-hidden">Loading…</span>
    </div>
  </div>
);

const V2Routes: React.FC = () => {
  return (
    <CampusProvider>
      <DashboardProvider>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<LayoutV2 />}>
              {/* Dashboard Routes */}
              <Route
                index
                element={<Navigate to="dashboard/engagement" replace />}
              />

              {/* New Dashboard Screens (Figma Design) - Protected by permissions */}
              <Route
                path="dashboard/engagement"
                element={
                  <PermissionGuard resource="engagement" fallback="redirect">
                    <DashboardEngagement />
                  </PermissionGuard>
                }
              />
              <Route
                path="dashboard/popular-features"
                element={
                  <PermissionGuard
                    resource="popular_features"
                    fallback="redirect"
                  >
                    <DashboardPopularFeatures />
                  </PermissionGuard>
                }
              />
              <Route
                path="dashboard/user-interactions"
                element={
                  <PermissionGuard
                    resource="user_interactions"
                    fallback="redirect"
                  >
                    <DashboardUserInteractions />
                  </PermissionGuard>
                }
              />
              <Route
                path="dashboard/community"
                element={
                  <PermissionGuard resource="community" fallback="redirect">
                    <DashboardCommunity />
                  </PermissionGuard>
                }
              />
              <Route
                path="dashboard/student-safety"
                element={
                  <PermissionGuard
                    resource="student_safety"
                    fallback="redirect"
                  >
                    <DashboardStudentSafety />
                  </PermissionGuard>
                }
              />
              <Route
                path="dashboard/student-behavior"
                element={
                  <PermissionGuard
                    resource="student_behavior"
                    fallback="redirect"
                  >
                    <DashboardStudentBehavior />
                  </PermissionGuard>
                }
              />

              {/* Campus Routes - Protected by permissions */}
              <Route
                path="manage-students/active"
                element={
                  <PermissionGuard
                    resource="active_students"
                    fallback="redirect"
                  >
                    <ActiveStudents />
                  </PermissionGuard>
                }
              />
              <Route
                path="manage-students/banned"
                element={
                  <PermissionGuard
                    resource="banned_students"
                    fallback="redirect"
                  >
                    <BannedStudents />
                  </PermissionGuard>
                }
              />
              <Route
                path="manage-students/deactivated"
                element={
                  <PermissionGuard
                    resource="inactive_students"
                    fallback="redirect"
                  >
                    <DeactivatedStudents />
                  </PermissionGuard>
                }
              />
              <Route
                path="manage-students/disengaged"
                element={
                  <PermissionGuard
                    resource="disengaged_students"
                    fallback="redirect"
                  >
                    <DisengagedStudents />
                  </PermissionGuard>
                }
              />

              {/* Events Routes - Protected by permissions */}
              <Route
                path="events"
                element={
                  <PermissionGuard
                    resource="events_manager"
                    fallback="redirect"
                  >
                    <EventsManager />
                  </PermissionGuard>
                }
              />
              <Route
                path="events/insights"
                element={
                  <PermissionGuard
                    resource="events_insights"
                    fallback="redirect"
                  >
                    <EventsInsights />
                  </PermissionGuard>
                }
              />

              {/* Spaces Routes - Protected by permissions */}
              <Route
                path="spaces"
                element={
                  <PermissionGuard
                    resource="spaces_manager"
                    fallback="redirect"
                  >
                    <SpacesManager />
                  </PermissionGuard>
                }
              />
              <Route
                path="spaces/insights"
                element={
                  <PermissionGuard
                    resource="spaces_insights"
                    fallback="redirect"
                  >
                    <SpacesInsights />
                  </PermissionGuard>
                }
              />

              {/* Ideas Routes - Protected by permissions */}
              <Route
                path="ideas"
                element={
                  <PermissionGuard resource="ideas_manager" fallback="redirect">
                    <IdeasManager />
                  </PermissionGuard>
                }
              />
              <Route
                path="ideas/insights"
                element={
                  <PermissionGuard
                    resource="ideas_insights"
                    fallback="redirect"
                  >
                    <IdeasInsights />
                  </PermissionGuard>
                }
              />

              {/* Moderation Routes - Protected by permissions */}
              <Route
                path="report-safety"
                element={
                  <PermissionGuard resource="report_safety" fallback="redirect">
                    <ReportSafety />
                  </PermissionGuard>
                }
              />
              <Route
                path="report-history"
                element={
                  <PermissionGuard
                    resource="report_history"
                    fallback="redirect"
                  >
                    <ReportHistory />
                  </PermissionGuard>
                }
              />

              {/* Admin Routes - Protected by permissions */}
              <Route
                path="admin/campuses"
                element={
                  <PermissionGuard resource="campuses" fallback="redirect">
                    <Campuses />
                  </PermissionGuard>
                }
              />
              <Route
                path="admin/ambassadors"
                element={
                  <PermissionGuard resource="ambassadors" fallback="redirect">
                    <Ambassadors />
                  </PermissionGuard>
                }
              />
              <Route
                path="admin/role-management"
                element={
                  <PermissionGuard
                    resource="role_management"
                    fallback="redirect"
                  >
                    <RoleManagement />
                  </PermissionGuard>
                }
              />
              <Route
                path="admin/settings"
                element={<AdministratorSettings />}
              />

              {/* Legacy Admin Routes (redirect to new paths) */}
              <Route
                path="campuses"
                element={<Navigate to="/admin/campuses" replace />}
              />
              <Route
                path="ambassadors"
                element={<Navigate to="/admin/ambassadors" replace />}
              />
              <Route
                path="role-management"
                element={<Navigate to="/admin/role-management" replace />}
              />

              {/* Settings Routes */}
              <Route
                path="administrators-roles"
                element={<div>Administrators Roles - Coming Soon</div>}
              />

              {/* Playground */}
              <Route
                path="playground/interest-cloud"
                element={<InterestCloud />}
              />
              <Route
                path="playground/interest-constellation"
                element={<InterestConstellation />}
              />
              <Route
                path="playground/interest-chord"
                element={<InterestChord />}
              />
              <Route
                path="playground/interest-pyramid"
                element={<InterestPyramid />}
              />
              <Route
                path="playground/active-spiral"
                element={<ActiveUsersSpiral />}
              />
              <Route
                path="playground/active-heat"
                element={<ActiveUsersHeat />}
              />
              <Route
                path="playground/active-rings"
                element={<ActiveUsersRings />}
              />
              <Route
                path="playground/active-funnel"
                element={<ActiveUsersFunnel />}
              />
              <Route
                path="playground/active-guitar"
                element={<ActiveUsersGuitar />}
              />
              <Route
                path="playground/active-drums"
                element={<ActiveUsersDrums />}
              />
              <Route
                path="playground/active-chimes"
                element={<ActiveUsersChimes />}
              />
              <Route
                path="playground/active-waves"
                element={<ActiveUsersWaves />}
              />
              <Route
                path="playground/active-orbs"
                element={<ActiveUsersOrbs />}
              />
              <Route
                path="playground/active-galaxy"
                element={<ActiveUsersGalaxy />}
              />

              {/* 404 */}
              <Route path="*" element={<div>Page Not Found</div>} />
            </Route>
          </Routes>
        </Suspense>
      </DashboardProvider>
    </CampusProvider>
  );
};

export default V2Routes;
