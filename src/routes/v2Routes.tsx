import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LayoutV2 } from "../layout-v2";
import EngagementAnalytics from "../pages-v2/EngagementAnalytics/EngagementAnalytics";
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
          <Route index element={<Navigate to="engagement" replace />} />
          <Route path="engagement" element={<EngagementAnalytics />} />

          {/* Placeholder routes for other pages */}
          <Route
            path="popular-features"
            element={<div>Popular Features - Coming Soon</div>}
          />
          <Route
            path="user-interactions"
            element={<div>User Interactions - Coming Soon</div>}
          />
          <Route
            path="community"
            element={<div>Community - Coming Soon</div>}
          />
          <Route
            path="student-safety"
            element={<div>Student Safety - Coming Soon</div>}
          />
          <Route
            path="student-behavior"
            element={<div>Student Behavior - Coming Soon</div>}
          />

          {/* Campus Routes */}
          <Route
            path="manage-students"
            element={<div>Manage Students - Coming Soon</div>}
          />
          <Route
            path="reported-content"
            element={<div>Reported Content - Coming Soon</div>}
          />
          <Route path="events" element={<div>Events - Coming Soon</div>} />
          <Route path="spaces" element={<div>Spaces - Coming Soon</div>} />
          <Route path="ideas" element={<div>Ideas - Coming Soon</div>} />

          {/* Admin Routes */}
          <Route path="campuses" element={<div>Campuses - Coming Soon</div>} />
          <Route
            path="ambassadors"
            element={<div>Ambassadors - Coming Soon</div>}
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
