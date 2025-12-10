import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import { SearchInput, Pagination } from "../../../components-v2";
import { ExportButton } from "../../../components-v2/ExportButton/ExportButton";
import { StatsCard } from "../components/StatsCard";
import { StudentData } from "../components/StudentTable";
import { DeactivatedStudentTable } from "../components/DeactivatedStudentTable";
import { StudentTableSkeleton } from "../components/StudentTableSkeleton/StudentTableSkeleton";
import { NoStudentsFound } from "../components/NoStudentsFound/NoStudentsFound";
import "./DeactivatedStudents.css";

export const DeactivatedStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const entriesPerPage = 10;

  const { data: studentsData, isLoading: isStudentsLoading } = useQuery({
    queryKey: ["students", currentPage, searchQuery, "deactivated"],
    queryFn: () =>
      apiClient.api.adminV2StudentsList({
        page: currentPage,
        limit: entriesPerPage,
        search: searchQuery,
        status: "deactivated",
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
    status: student.status,
    interests: student.interests || [],
    deactivatedDate: student.deactivatedDate,
    deactivatedBy: student.deactivatedBy,
    memberSince: student.memberSince,
    onlineLast: student.onlineLast,
    avatar: student.avatar,
  }));

  const totalPages = Math.ceil(
    (studentsData?.data.total || 0) / entriesPerPage
  );
  const paginatedStudents = students;

  const handleStudentClick = (student: StudentData) => {
    console.log("Student clicked:", student);
  };

  const handleExport = () => {
    console.log("Export clicked");
  };

  return (
    <main className="deactivated-students-page">
      <div className="deactivated-students-stats">
        <StatsCard
          title="Total deactivated students"
          value={statsData?.data.totalStudents?.toString() || "0"}
          iconName="double-users-icon"
          iconBgColor="#E9FCF4"
          iconColor="#00C617"
          trend={{
            value: "2.3%",
            isPositive: false,
            label: "from last month",
          }}
        />
        <StatsCard
          title="Deactivated this month"
          value="12"
          iconName="lock-icon"
          iconBgColor="#FCE9E9"
          iconColor="#FF8082"
          tooltip="Students who were deactivated in the current month"
          showTooltip={hoveredTooltip === "this-month"}
          onTooltipHover={(show) =>
            setHoveredTooltip(show ? "this-month" : null)
          }
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
              onChange={setSearchQuery}
              placeholder="Search"
              variant="primary"
            />
          </div>
          <ExportButton onClick={handleExport} />
        </div>

        {isLoading ? (
          <StudentTableSkeleton />
        ) : paginatedStudents.length === 0 ? (
          <NoStudentsFound />
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
          />
        )}

        {!isLoading && paginatedStudents.length > 0 && (
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
