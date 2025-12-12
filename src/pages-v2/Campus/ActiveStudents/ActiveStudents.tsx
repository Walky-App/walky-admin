import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import { SearchInput } from "../../../components-v2";
import { ExportButton } from "../../../components-v2/ExportButton/ExportButton";
import { StatsCard } from "../components/StatsCard";
import { StudentTable, StudentData } from "../components/StudentTable";
import { Pagination } from "../components/Pagination";
import { StudentTableSkeleton } from "../components/StudentTableSkeleton/StudentTableSkeleton";
import { NoStudentsFound } from "../components/NoStudentsFound/NoStudentsFound";
import { formatMemberSince } from "../../../lib/utils/dateUtils";
import "./ActiveStudents.css";

export const ActiveStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const exportRef = useRef<HTMLElement | null>(null);
  const entriesPerPage = 10;

  const { data: studentsData, isLoading: isStudentsLoading } = useQuery({
    queryKey: ["students", currentPage, searchQuery],
    queryFn: () =>
      apiClient.api.adminV2StudentsList({
        page: currentPage,
        limit: entriesPerPage,
        search: searchQuery,
      }),
  });

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["studentStats"],
    queryFn: () => apiClient.api.adminV2StudentsStatsList(),
  });

  const isLoading = isStudentsLoading || isStatsLoading;

  const students = (studentsData?.data.data || []).map((student: any) => ({
    id: student.id,
    userId: student.userId,
    name: student.name,
    email: student.email,
    interests: student.interests || [],
    avatar: student.avatar,
    status: student.status,
    memberSince: formatMemberSince(student.memberSince),
    onlineLast: student.onlineLast,
    isFlagged: student.isFlagged,
  }));

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

  return (
    <main className="active-students-page" ref={exportRef}>
      <div className="active-students-stats">
        <StatsCard
          title="Total students"
          value={statsData?.data.totalStudents?.toString() || "0"}
          iconName="double-users-icon"
          iconBgColor="#E9FCF4"
          iconColor="#00C617"
          trend={{
            value: "8.5%",
            isPositive: true,
            label: "from last month",
          }}
        />
        <StatsCard
          title="Students with app access"
          value={statsData?.data.studentsWithAppAccess?.toString() || "0"}
          iconName="check-icon"
          iconBgColor="#E9FCF4"
          iconColor="#00C617"
          trend={{
            value: "8.5%",
            isPositive: true,
            label: "from last month",
          }}
          tooltip="These students have active access and are not banned or deactivated"
          showTooltip={hoveredTooltip === "app-access"}
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
              onChange={setSearchQuery}
              placeholder="Search"
              variant="primary"
            />
          </div>
          <ExportButton captureRef={exportRef} filename="active_students" />
        </div>

        {isLoading ? (
          <StudentTableSkeleton />
        ) : paginatedStudents.length === 0 ? (
          <NoStudentsFound />
        ) : (
          <StudentTable
            students={paginatedStudents}
            onStudentClick={handleStudentClick}
            onActionClick={handleActionClick}
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
