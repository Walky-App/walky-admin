import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import { SearchInput, Pagination } from "../../../components-v2";
import { ExportButton } from "../../../components-v2/ExportButton/ExportButton";
import { StatsCard } from "../components/StatsCard";
import { StudentData, StudentTableColumn } from "../components/StudentTable";
import { DeactivatedStudentTable } from "../components/DeactivatedStudentTable";
import { StudentTableSkeleton } from "../components/StudentTableSkeleton/StudentTableSkeleton";
import { formatMemberSince } from "../../../lib/utils/dateUtils";
import { usePermissions } from "../../../hooks/usePermissions";
import { useSchool } from "../../../contexts/SchoolContext";
import { useCampus } from "../../../contexts/CampusContext";
import "./DeactivatedStudents.css";

export const DeactivatedStudents: React.FC = () => {
  const { canExport } = usePermissions();
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Check permissions for this page
  const showExport = canExport("inactive_students");

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };
  const [sortBy, setSortBy] = useState<StudentTableColumn | undefined>(
    undefined
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const exportRef = useRef<HTMLElement | null>(null);
  const entriesPerPage = 10;

  const { data: studentsData, isLoading: isStudentsLoading } = useQuery({
    queryKey: [
      "students",
      currentPage,
      searchQuery,
      "deactivated",
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      apiClient.api.adminV2StudentsList({
        page: currentPage,
        limit: entriesPerPage,
        search: searchQuery,
        status: "deactivated",
        sortBy: sortBy as
          | "name"
          | "email"
          | "memberSince"
          | "onlineLast"
          | "status"
          | undefined,
        sortOrder,
      }),
  });

  const { data: statsData } = useQuery({
    queryKey: ["studentStats", selectedSchool?._id, selectedCampus?._id],
    queryFn: () =>
      apiClient.api.adminV2StudentsStatsList({
        schoolId: selectedSchool?._id,
        campusId: selectedCampus?._id,
      }),
  });

  const isListLoading = isStudentsLoading;

  const parseChange = (value?: number | string | null) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === "number")
      return Number.isFinite(value) ? value : undefined;
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const buildTrend = (change?: number) => {
    const safeChange = change ?? 0;
    return {
      value: `${Math.abs(safeChange).toFixed(1)}%`,
      isPositive: safeChange >= 0,
      label: "from last month",
    } as const;
  };

  const stats = (statsData?.data || {}) as Record<string, unknown>;
  const totalDeactivatedChange = parseChange(
    (stats["totalDeactivatedChangePercentage"] as number | string | null) ??
      (stats["totalDeactivatedChange"] as number | string | null) ??
      (stats["totalDeactivatedTrend"] as number | string | null) ??
      (stats["totalDeactivatedMoM"] as number | string | null)
  );
  const permanentBansChange = parseChange(
    (stats["totalPermanentBansChangePercentage"] as number | string | null) ??
      (stats["totalPermanentBansChange"] as number | string | null) ??
      (stats["totalPermanentBansTrend"] as number | string | null) ??
      (stats["totalPermanentBansMoM"] as number | string | null)
  );

  const totalDeactivatedTrend = buildTrend(totalDeactivatedChange);
  const permanentBansTrend = buildTrend(permanentBansChange);

  const students: StudentData[] = (studentsData?.data.data || []).map(
    (student) => ({
      id: student.id || "",
      userId: student.userId || "",
      name: student.name || "",
      email: student.email || "",
      status: (student.status as StudentData["status"]) || "deactivated",
      interests: student.interests || [],
      deactivatedDate: student.deactivatedDate,
      deactivatedBy: student.deactivatedBy,
      memberSince: formatMemberSince(student.memberSince),
      onlineLast: student.onlineLast || "",
      avatar: student.avatar,
    })
  );

  const totalPages = Math.ceil(
    (studentsData?.data.total || 0) / entriesPerPage
  );
  const paginatedStudents = students;

  const handleStudentClick = (student: StudentData) => {
    console.log("Student clicked:", student);
  };

  const handleSortChange = (
    field: StudentTableColumn,
    order: "asc" | "desc"
  ) => {
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  return (
    <main className="deactivated-students-page" ref={exportRef}>
      <div className="deactivated-students-stats">
        <StatsCard
          title="Total deactivated students"
          value={studentsData?.data.total?.toString() || "0"}
          iconName="double-users-icon"
          iconBgColor="#E9FCF4"
          iconColor="#00C617"
          trend={totalDeactivatedTrend}
        />
        <StatsCard
          title="Permanent bans"
          value={statsData?.data.totalPermanentBans?.toString() || "0"}
          iconName="lock-icon"
          iconBgColor="#FCE9E9"
          iconColor="#FF8082"
          trend={permanentBansTrend}
        />
      </div>

      <div className="deactivated-students-content">
        <div className="deactivated-students-header">
          <div className="deactivated-students-title-section">
            <h1 className="deactivated-students-title">
              List of deactivated students in Walky
            </h1>
            <SearchInput
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search"
              variant="primary"
            />
          </div>
          {showExport && (
            <ExportButton
              captureRef={exportRef}
              filename="deactivated_students"
            />
          )}
        </div>

        {isListLoading ? (
          <StudentTableSkeleton />
        ) : (
          <DeactivatedStudentTable
            students={paginatedStudents}
            columns={[
              "userId",
              "name",
              "email",
              "deactivatedBy",
              "status",
              "memberSince",
              "deactivatedDate",
            ]}
            onStudentClick={handleStudentClick}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            emptyMessage="No deactivated users"
          />
        )}

        {!isListLoading && paginatedStudents.length > 0 && (
          <div className="deactivated-students-pagination">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalEntries={studentsData?.data.total || 0}
              entriesPerPage={entriesPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </main>
  );
};
