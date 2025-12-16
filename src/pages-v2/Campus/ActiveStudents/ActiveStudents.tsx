import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import { Pagination, SearchInput } from "../../../components-v2";
import { ExportButton } from "../../../components-v2/ExportButton/ExportButton";
import { StatsCard } from "../components/StatsCard";
import {
  StudentTable,
  StudentData,
  StudentTableColumn,
} from "../components/StudentTable";
import { StudentTableSkeleton } from "../components/StudentTableSkeleton/StudentTableSkeleton";
import { formatMemberSince } from "../../../lib/utils/dateUtils";
import "./ActiveStudents.css";

export const ActiveStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<StudentTableColumn | undefined>(
    undefined
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const exportRef = useRef<HTMLElement | null>(null);
  const entriesPerPage = 10;

  // Type for API sortBy parameter
  type ApiSortField =
    | "name"
    | "email"
    | "memberSince"
    | "onlineLast"
    | "status";
  const apiSortBy = sortBy as ApiSortField | undefined;

  const { data: studentsData, isLoading: isStudentsLoading } = useQuery({
    queryKey: [
      "students",
      currentPage,
      searchQuery,
      "active",
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      apiClient.api.adminV2StudentsList({
        page: currentPage,
        limit: entriesPerPage,
        search: searchQuery,
        status: "active",
        sortBy: apiSortBy,
        sortOrder,
      }),
  });

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["studentStats"],
    queryFn: () => apiClient.api.adminV2StudentsStatsList(),
  });

  const isLoading = isStudentsLoading || isStatsLoading;

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
  const totalStudentsChange = parseChange(
    (stats["totalStudentsChangePercentage"] as number | string | null) ??
      (stats["totalStudentsChange"] as number | string | null) ??
      (stats["totalStudentsTrend"] as number | string | null) ??
      (stats["totalStudentsMoM"] as number | string | null)
  );
  const studentsWithAccessChange = parseChange(
    (stats["studentsWithAppAccessChangePercentage"] as
      | number
      | string
      | null) ??
      (stats["studentsWithAppAccessChange"] as number | string | null) ??
      (stats["studentsWithAppAccessTrend"] as number | string | null) ??
      (stats["studentsWithAppAccessMoM"] as number | string | null)
  );

  const totalStudentsTrend = buildTrend(totalStudentsChange);
  const studentsWithAccessTrend = buildTrend(studentsWithAccessChange);

  const students: StudentData[] = (studentsData?.data.data || []).map(
    (student) => ({
      id: student.id || "",
      userId: student.userId || "",
      name: student.name || "",
      email: student.email || "",
      interests: student.interests || [],
      avatar: student.avatar,
      status: (student.status || "active") as StudentData["status"],
      memberSince: formatMemberSince(student.memberSince),
      onlineLast: student.onlineLast || "",
      isFlagged: student.isFlagged,
      flagReason: (student as any).flagReason,
    })
  );

  const totalPages = Math.ceil(
    (studentsData?.data.total || 0) / entriesPerPage
  );
  const paginatedStudents = students; // API already returns paginated data

  const handleStudentClick = (student: StudentData) => {
    console.log("Student clicked:", student);
  };

  const handleActionClick = (student: StudentData) => {
    console.log("Action clicked for:", student);
  };

  const handleSortChange = (
    field: StudentTableColumn,
    order: "asc" | "desc"
  ) => {
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  return (
    <main className="active-students-page" ref={exportRef}>
      <div className="active-students-stats">
        <StatsCard
          title="Total students"
          value={statsData?.data.totalStudents?.toString() || "0"}
          iconName="double-users-icon"
          iconBgColor="#E9FCF4"
          iconColor="#00C617"
          trend={totalStudentsTrend}
        />
        <StatsCard
          title="Students with app access"
          value={statsData?.data.studentsWithAppAccess?.toString() || "0"}
          iconName="check-icon"
          iconBgColor="#E9FCF4"
          iconColor="#00C617"
          tooltip="These students have active access and are not banned or deactivated"
          showTooltip={hoveredTooltip === "app-access"}
          trend={studentsWithAccessTrend}
          onTooltipHover={(show) =>
            setHoveredTooltip(show ? "app-access" : null)
          }
        />
      </div>

      <div className="active-students-content">
        <div className="active-students-header">
          <div className="active-students-title-section">
            <h1 className="active-students-title">
              List of active students in Walky
            </h1>
            <SearchInput
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search"
              variant="primary"
            />
          </div>
          <ExportButton captureRef={exportRef} filename="active_students" />
        </div>

        {isLoading ? (
          <StudentTableSkeleton />
        ) : (
          <StudentTable
            students={paginatedStudents}
            onStudentClick={handleStudentClick}
            onActionClick={handleActionClick}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
        )}

        {!isLoading && paginatedStudents.length > 0 && (
          <div className="active-students-pagination">
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
