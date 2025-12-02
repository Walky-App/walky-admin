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
      <Routes>
        <Route path="/" element={<LayoutV2 />}>
          {/* Dashboard Routes */}
          <Route
            index
            element={<Navigate to="dashboard/engagement" replace />}
          />

          {/* New Dashboard Screens (Figma Design) */}
          <Route
            path="dashboard/engagement"
            element={<DashboardEngagement />}
          />
          <Route
            path="dashboard/popular-features"
            element={<DashboardPopularFeatures />}
          />
          <Route
            path="dashboard/user-interactions"
            element={<DashboardUserInteractions />}
          />
          <Route path="dashboard/community" element={<DashboardCommunity />} />
          <Route
            path="dashboard/student-safety"
            element={<DashboardStudentSafety />}
          />
          <Route
            path="dashboard/student-behavior"
            element={<DashboardStudentBehavior />}
          />

          {/* Campus Routes */}
          <Route path="manage-students/active" element={<ActiveStudents />} />
          <Route path="manage-students/banned" element={<BannedStudents />} />
          <Route
            path="manage-students/deactivated"
            element={<DeactivatedStudents />}
          />
          <Route
            path="manage-students/disengaged"
            element={<DisengagedStudents />}
          />

          {/* Events Routes */}
          <Route path="events" element={<EventsManager />} />
          <Route path="events/insights" element={<EventsInsights />} />

          {/* Spaces Routes */}
          <Route path="spaces" element={<SpacesManager />} />
          <Route path="spaces/insights" element={<SpacesInsights />} />

          {/* Ideas Routes */}
          <Route path="ideas" element={<IdeasManager />} />
          <Route path="ideas/insights" element={<IdeasInsights />} />

          {/* Moderation Routes */}
          <Route path="report-safety" element={<ReportSafety />} />
          <Route path="report-history" element={<ReportHistory />} />

          {/* Admin Routes */}
          <Route path="admin/campuses" element={<Campuses />} />
          <Route path="admin/ambassadors" element={<Ambassadors />} />
          <Route path="admin/role-management" element={<RoleManagement />} />
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
    </CampusProvider>
  );
};

export default V2Routes;
