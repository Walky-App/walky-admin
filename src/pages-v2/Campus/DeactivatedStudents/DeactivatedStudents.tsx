import React, { useState } from "react";
import { AssetIcon } from "../../../components-v2";
import { ExportButton } from "../../../components-v2/ExportButton/ExportButton";
import { StatsCard } from "../components/StatsCard";
import { Pagination } from "../components/Pagination";
import { StudentTable, StudentData } from "../components/StudentTable";
import "./DeactivatedStudents.css";

export const DeactivatedStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const entriesPerPage = 10;

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

  const handleActionClick = (student: StudentData) => {
    console.log("Action clicked for:", student);
  };

  const handleExport = () => {
    console.log("Export clicked");
  };

  return (
    <div className="deactivated-students-page">
      <div className="deactivated-students-stats">
        <StatsCard
          title="Total deactivated students"
          value="87"
          iconName="lock-icon"
          iconBgColor="#FFF4E6"
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
          iconBgColor="#FFE6E6"
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
            <div className="deactivated-students-search">
              <AssetIcon name="search-icon" size={24} className="search-icon" />
              <input
                data-testid="search-input"
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <ExportButton onClick={handleExport} />
        </div>

        <StudentTable
          students={paginatedStudents}
          columns={[
            "userId",
            "name",
            "email",
            "interests",
            "deactivatedDate",
            "deactivatedBy",
            "memberSince",
          ]}
          onStudentClick={handleStudentClick}
          onActionClick={handleActionClick}
        />

        <div className="deactivated-students-pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={filteredStudents.length}
            entriesPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};
