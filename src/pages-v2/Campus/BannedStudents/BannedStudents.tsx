import React, { useRef, useState } from "react";
import { SearchInput, Pagination } from "../../../components-v2";
import { ExportButton } from "../../../components-v2/ExportButton/ExportButton";
import { StatsCard } from "../components/StatsCard";
import { BannedStudentTable } from "../components/BannedStudentTable";
import { StudentData, StudentTableColumn } from "../components/StudentTable";
import { StudentTableSkeleton } from "../components/StudentTableSkeleton/StudentTableSkeleton";
import { formatMemberSince } from "../../../lib/utils/dateUtils";
import { usePermissions } from "../../../hooks/usePermissions";
import { useSchool } from "../../../contexts/SchoolContext";
import { useCampus } from "../../../contexts/CampusContext";
import "./BannedStudents.css";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";

export const BannedStudents: React.FC = () => {
  const { canExport } = usePermissions();
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Check permissions for this page
  const showExport = canExport("banned_students");

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
      "banned",
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      apiClient.api.adminV2StudentsList({
        page: currentPage,
        limit: entriesPerPage,
        search: searchQuery,
        status: "banned",
        sortBy: apiSortBy,
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

  const isLoading = isStudentsLoading;

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
  const totalBannedChange = parseChange(
    (stats["totalBannedChangePercentage"] as number | string | null) ??
      (stats["totalBannedChange"] as number | string | null) ??
      (stats["totalBannedTrend"] as number | string | null) ??
      (stats["totalBannedMoM"] as number | string | null)
  );
  const permanentBansChange = parseChange(
    (stats["totalPermanentBansChangePercentage"] as number | string | null) ??
      (stats["totalPermanentBansChange"] as number | string | null) ??
      (stats["totalPermanentBansTrend"] as number | string | null) ??
      (stats["totalPermanentBansMoM"] as number | string | null)
  );

  const totalBannedTrend = buildTrend(totalBannedChange);
  const permanentBansTrend = buildTrend(permanentBansChange);

  // Extended type for additional fields that may come from API
  type ExtendedStudent = {
    id?: string;
    userId?: string;
    name?: string;
    email?: string;
    interests?: string[];
    status?: string;
    memberSince?: string;
    onlineLast?: string;
    isFlagged?: boolean;
    flagReason?: string;
    avatar?: string;
    bannedDate?: string;
    bannedBy?: string;
    bannedByEmail?: string;
    bannedTime?: string;
    reason?: string;
    duration?: string;
    totalPeers?: number;
    bio?: string;
    studyMain?: string;
    areaOfStudy?: string;
    lastLogin?: string;
    banHistory?: Array<{
      title?: string;
      duration?: string;
      expiresIn?: string;
      reason?: string;
      bannedDate?: string;
      bannedTime?: string;
      bannedBy?: string;
    }>;
    blockedByUsers?: Array<{
      id?: string;
      name?: string;
      avatar?: string;
      date?: string;
      time?: string;
      reason?: string;
    }>;
    reportHistory?: Array<unknown>;
    reported?: boolean;
  };

  const students: StudentData[] = (studentsData?.data.data || []).map((s) => {
    const student = s as ExtendedStudent;
    return {
      id: student.id || "",
      userId: student.userId || "",
      name: student.name || "",
      email: student.email || "",
      status: (student.status || "banned") as StudentData["status"],
      interests: student.interests || [],
      bannedDate: student.bannedDate,
      bannedBy: student.bannedBy,
      bannedByEmail: student.bannedByEmail,
      bannedTime: student.bannedTime,
      reason: student.reason,
      duration: student.duration,
      memberSince: formatMemberSince(student.memberSince),
      onlineLast: student.onlineLast || "",
      avatar: student.avatar,
      areaOfStudy: student.areaOfStudy || student.studyMain,
      lastLogin: student.lastLogin,
      totalPeers: student.totalPeers,
      bio: student.bio,
      banHistory: student.banHistory?.map((b) => ({
        title: b.title || "",
        duration: b.duration || "",
        expiresIn: b.expiresIn,
        reason: b.reason || "",
        bannedDate: b.bannedDate || "",
        bannedTime: b.bannedTime || "",
        bannedBy: b.bannedBy || "",
      })),
      blockedByUsers: student.blockedByUsers?.map((bu) => ({
        id: bu.id || "",
        name: bu.name || "",
        avatar: bu.avatar,
        date: bu.date || "",
        time: bu.time || "",
      })),
      reportHistory: student.reportHistory as StudentData["reportHistory"],
      isFlagged: student.isFlagged,
      flagReason: student.flagReason,
    };
  });

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
    <main className="banned-students-page" ref={exportRef}>
      <div className="banned-students-stats">
        <StatsCard
          title="Total banned students"
          value={studentsData?.data.total?.toString() || "0"}
          iconName="double-users-icon"
          iconBgColor="#E9FCF4"
          iconColor="#00C617"
          trend={totalBannedTrend}
        />
        <StatsCard
          title="Permanent bans"
          value={statsData?.data.totalPermanentBans?.toString() || "0"}
          iconName="lock-icon"
          iconBgColor="#FFF3E0"
          iconColor="#F69B39"
          tooltip="Students with permanent ban status"
          showTooltip={hoveredTooltip === "permanent-bans"}
          trend={permanentBansTrend}
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
              onChange={handleSearchChange}
              placeholder="Search"
              variant="primary"
            />
          </div>
          {showExport && (
            <ExportButton captureRef={exportRef} filename="banned_students" />
          )}
        </div>

        {isLoading ? (
          <StudentTableSkeleton />
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
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            emptyMessage="No banned users"
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
