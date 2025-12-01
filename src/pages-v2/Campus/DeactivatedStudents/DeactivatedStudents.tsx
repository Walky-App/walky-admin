import React, { useState } from "react";
import { SearchInput } from "../../../components-v2";
import { ExportButton } from "../../../components-v2/ExportButton/ExportButton";
import { StatsCard } from "../components/StatsCard";
import { Pagination } from "../components/Pagination";
import { StudentData } from "../components/StudentTable";
import { DeactivatedStudentTable } from "../components/DeactivatedStudentTable";
import { useMixpanel } from "../../../hooks";
import "./DeactivatedStudents.css";

export const DeactivatedStudents: React.FC = () => {
  const { trackEvent } = useMixpanel();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const entriesPerPage = 10;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 0) {
      trackEvent("Deactivated Students - Search Input", {
        search_query: value,
      });
    }
  };

  // Mock data
  const mockStudents: StudentData[] = [
    {
      id: "1",
      userId: "166g...fjhsgt",
      name: "Austin Smith",
      email: "Austin@FIU.edu.co",
      status: "deactivated" as const,
      interests: ["Ballet", "Billiards", "Chess"],
      deactivatedDate: "Sep 28, 2025",
      deactivatedBy: "Self",
      memberSince: "Sep 28, 2025",
      onlineLast: "Active now",
      avatar: "A",
    },
    {
      id: "2",
      userId: "266g...fjhsgt",
      name: "Leo Johnson",
      email: "Leo@FIU.edu.co",
      status: "deactivated" as const,
      interests: ["Ballet", "Billiards", "Swimming"],
      deactivatedDate: "Sep 28, 2025",
      deactivatedBy: "Admin",
      memberSince: "Sep 28, 2025",
      onlineLast: "2 minutes ago",
      avatar: "L",
    },
    {
      id: "3",
      userId: "366g...fjhsgt",
      name: "Natasha Brown",
      email: "Natasha@FIU.edu.co",
      status: "deactivated" as const,
      interests: ["Ballet", "Billiards", "Art"],
      deactivatedDate: "Sep 28, 2025",
      deactivatedBy: "Self",
      memberSince: "Sep 28, 2025",
      onlineLast: "3 hours ago",
      avatar: "N",
    },
  ];

  // Duplicate data to have more entries
  const allStudents = Array.from({ length: 87 }, (_, index) => ({
    ...mockStudents[index % mockStudents.length],
    id: `${index + 1}`,
    userId: `${100 + index}g...fjhsgt`,
  }));

  const filteredStudents = allStudents.filter((student) =>
    Object.values(student).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredStudents.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  const handleStudentClick = (student: StudentData) => {
    console.log("Student clicked:", student);
  };

  const handleExport = () => {
    console.log("Export clicked");
    trackEvent("Deactivated Students - Data Exported", {
      total_students: filteredStudents.length,
    });
  };

  return (
    <main className="deactivated-students-page">
      <div className="deactivated-students-stats">
        <StatsCard
          title="Total deactivated students"
          value="87"
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
              onChange={handleSearchChange}
              placeholder="Search"
              variant="primary"
            />
          </div>
          <ExportButton onClick={handleExport} />
        </div>

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

        <div className="deactivated-students-pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={filteredStudents.length}
            entriesPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
            pageContext="Deactivated Students"
          />
        </div>
      </div>
    </main>
  );
};
