import React, { useState } from "react";
import { SearchInput, Pagination } from "../../../components-v2";
import { ExportButton } from "../../../components-v2/ExportButton/ExportButton";
import { StatsCard } from "../components/StatsCard";
import { BannedStudentTable } from "../components/BannedStudentTable";
import { StudentData } from "../components/StudentTable";
import { StudentTableSkeleton } from "../components/StudentTableSkeleton/StudentTableSkeleton";
import { NoStudentsFound } from "../components/NoStudentsFound/NoStudentsFound";
import "./BannedStudents.css";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";

export const BannedStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const entriesPerPage = 10;

  const { data: studentsData, isLoading: isStudentsLoading } = useQuery({
    queryKey: ["students", currentPage, searchQuery, "banned"],
    queryFn: () =>
      apiClient.api.adminV2StudentsList({
        page: currentPage,
        limit: entriesPerPage,
        search: searchQuery,
        status: "banned",
      }),
  });

  const { data: statsData } = useQuery({
    queryKey: ["studentStats"],
    queryFn: () => apiClient.api.adminV2StudentsStatsList(),
  });

  const isLoading = isStudentsLoading;

  const students = (studentsData?.data.data || []).map((student: any) => ({
    id: student.id,
    userId: student.userId,
    name: student.name,
    email: student.email,
    status: student.status,
    interests: student.interests || [],
    bannedDate: student.bannedDate,
    bannedBy: student.bannedBy,
    bannedByEmail: student.bannedByEmail,
    bannedTime: student.bannedTime,
    reason: student.reason,
    duration: student.duration,
    memberSince: student.memberSince,
    onlineLast: student.onlineLast,
    avatar: student.avatar,
    areaOfStudy: student.areaOfStudy,
    lastLogin: student.lastLogin,
    totalPeers: student.totalPeers,
    bio: student.bio,
    banHistory: student.banHistory,
    blockedByUsers: student.blockedByUsers,
    reportHistory: student.reportHistory,
  }));

  const totalPages = Math.ceil(
    (studentsData?.data.total || 0) / entriesPerPage
  );
  const paginatedStudents = students;

  const handleExport = () => {
    console.log("Export banned students data");
  };

  const handleStudentClick = (student: StudentData) => {
    console.log("Student clicked:", student);
  };

  return (
    <main className="banned-students-page">
      <div className="banned-students-stats">
        <StatsCard
          title="Total banned students"
          value={studentsData?.data.total?.toString() || "0"}
          iconName="double-users-icon"
          iconBgColor="#E9FCF4"
          iconColor="#00C617"
          trend={{
            value: "12%",
            isPositive: false,
            label: "from last month",
          }}
        />
        <StatsCard
          title="Permanent bans"
          value={statsData?.data.totalPermanentBans?.toString() || "0"}
          iconName="lock-icon"
          iconBgColor="#FFF3E0"
          iconColor="#F69B39"
          tooltip="Students with permanent ban status"
          showTooltip={hoveredTooltip === "permanent-bans"}
          onTooltipHover={(show) =>
            setHoveredTooltip(show ? "permanent-bans" : null)
          }
        />
      </div>

      <div className="banned-students-content">
        <div className="banned-students-header">
          <div className="banned-students-title-section">
            <h1 className="banned-students-title">
              List of banned students in Walky
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
          <BannedStudentTable
            students={paginatedStudents}
            columns={[
              "userId",
              "name",
              "bannedBy",
              "duration",
              "status",
              "bannedDate",
              "reason",
            ]}
            onStudentClick={handleStudentClick}
          />
        )}

        {!isLoading && paginatedStudents.length > 0 && (
          <div className="banned-students-pagination">
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
