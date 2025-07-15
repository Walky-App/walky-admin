import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getCurrentUserRole } from "../utils/UserRole";
import { Role } from "../types/Role";
import { schoolService } from "../services/schoolService";

interface AdminSchoolGuardProps {
  children: React.ReactNode;
}

export const AdminSchoolGuard = ({ children }: AdminSchoolGuardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = getCurrentUserRole();

  useEffect(() => {
    // Only check for admin users
    if (user && role === Role.ADMIN) {
      const selectedSchool = schoolService.getSelectedSchool();

      // If admin doesn't have a selected school, redirect to school selection
      if (!selectedSchool) {
        navigate("/school-selection");
      }
    }
  }, [user, role, navigate]);

  // If user is admin and doesn't have a selected school, don't render children
  if (user && role === Role.ADMIN && !schoolService.getSelectedSchool()) {
    return null;
  }

  return <>{children}</>;
};
