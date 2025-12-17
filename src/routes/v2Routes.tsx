import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LayoutV2 } from "../layout-v2";
import DashboardEngagement from "../pages-v2/Dashboard/Engagement/Engagement";
import DashboardPopularFeatures from "../pages-v2/Dashboard/PopularFeatures/PopularFeatures";
import DashboardUserInteractions from "../pages-v2/Dashboard/UserInteractions";
import DashboardCommunity from "../pages-v2/Dashboard/Community";
import DashboardStudentSafety from "../pages-v2/Dashboard/StudentSafety";
import DashboardStudentBehavior from "../pages-v2/Dashboard/StudentBehavior";
import { ActiveStudents } from "../pages-v2/Campus/ActiveStudents";
import { BannedStudents } from "../pages-v2/Campus/BannedStudents";
import { DeactivatedStudents } from "../pages-v2/Campus/DeactivatedStudents";
import { DisengagedStudents } from "../pages-v2/Campus/DisengagedStudents";
import { EventsManager, EventsInsights } from "../pages-v2/Events";
import { SpacesManager, SpacesInsights } from "../pages-v2/Spaces";
import { IdeasManager, IdeasInsights } from "../pages-v2/Ideas";
import { ReportSafety, ReportHistory } from "../pages-v2/Moderation";
import {
  Campuses,
  Ambassadors,
  RoleManagement,
  AdministratorSettings,
} from "../pages-v2/Admin";
import { CampusProvider } from "../contexts/CampusContext";
import { DashboardProvider } from "../contexts/DashboardContext";
import { PermissionGuard } from "../components-v2";

/**
 * Example router configuration for V2 layout
 *
 * To use this in your App.tsx or main router:
 *
 * import { V2Routes } from './routes/v2Routes';
 *
 * <Routes>
 *   <Route path="/v2/*" element={<V2Routes />} />
 * </Routes>
 *
 * Note: SchoolProvider is already available from main.tsx
 * We wrap V2 routes with CampusProvider for campus-specific functionality
 */

const V2Routes: React.FC = () => {
  return (
    <CampusProvider>
      <DashboardProvider>
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
                <PermissionGuard resource="popular_features" fallback="redirect">
                  <DashboardPopularFeatures />
                </PermissionGuard>
              }
            />
            <Route
              path="dashboard/user-interactions"
              element={
                <PermissionGuard resource="user_interactions" fallback="redirect">
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
                <PermissionGuard resource="student_safety" fallback="redirect">
                  <DashboardStudentSafety />
                </PermissionGuard>
              }
            />
            <Route
              path="dashboard/student-behavior"
              element={
                <PermissionGuard resource="student_behavior" fallback="redirect">
                  <DashboardStudentBehavior />
                </PermissionGuard>
              }
            />

            {/* Campus Routes - Protected by permissions */}
            <Route
              path="manage-students/active"
              element={
                <PermissionGuard resource="active_students" fallback="redirect">
                  <ActiveStudents />
                </PermissionGuard>
              }
            />
            <Route
              path="manage-students/banned"
              element={
                <PermissionGuard resource="banned_students" fallback="redirect">
                  <BannedStudents />
                </PermissionGuard>
              }
            />
            <Route
              path="manage-students/deactivated"
              element={
                <PermissionGuard resource="inactive_students" fallback="redirect">
                  <DeactivatedStudents />
                </PermissionGuard>
              }
            />
            <Route
              path="manage-students/disengaged"
              element={
                <PermissionGuard resource="disengaged_students" fallback="redirect">
                  <DisengagedStudents />
                </PermissionGuard>
              }
            />

            {/* Events Routes - Protected by permissions */}
            <Route
              path="events"
              element={
                <PermissionGuard resource="events_manager" fallback="redirect">
                  <EventsManager />
                </PermissionGuard>
              }
            />
            <Route
              path="events/insights"
              element={
                <PermissionGuard resource="events_insights" fallback="redirect">
                  <EventsInsights />
                </PermissionGuard>
              }
            />

            {/* Spaces Routes - Protected by permissions */}
            <Route
              path="spaces"
              element={
                <PermissionGuard resource="spaces_manager" fallback="redirect">
                  <SpacesManager />
                </PermissionGuard>
              }
            />
            <Route
              path="spaces/insights"
              element={
                <PermissionGuard resource="spaces_insights" fallback="redirect">
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
                <PermissionGuard resource="ideas_insights" fallback="redirect">
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
                <PermissionGuard resource="report_history" fallback="redirect">
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
                <PermissionGuard resource="role_management" fallback="redirect">
                  <RoleManagement />
                </PermissionGuard>
              }
            />
            <Route path="admin/settings" element={<AdministratorSettings />} />

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

            {/* 404 */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Route>
        </Routes>
      </DashboardProvider>
    </CampusProvider>
  );
};

export default V2Routes;
