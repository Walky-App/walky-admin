import React, { useState } from "react";
import { SearchInput } from "../../../components-v2";
import { ExportButton } from "../../../components-v2/ExportButton/ExportButton";
import { StatsCard } from "../components/StatsCard";
import { StudentTable, StudentData } from "../components/StudentTable";
import { Pagination } from "../components/Pagination";
import "./ActiveStudents.css";

export const ActiveStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const entriesPerPage = 10;

  // Mock data - replace with API call
  const mockStudents: StudentData[] = [
    {
      id: "1",
      userId: "166g...fjhsgt",
      name: "Austin Smith",
      email: "Austin@FIU.edu.co",
      interests: ["Ballet", "Billiards", "Chess", "Swimming", "Art"],
      status: "active",
      memberSince: "Sep 28, 2025",
      onlineLast: "Active now",
      isFlagged: true,
    },
    {
      id: "2",
      userId: "266g...fjhsgt",
      name: "Leo Johnson",
      email: "Leo@FIU.edu.co",
      interests: ["Ballet", "Billiards", "Tennis"],
      status: "active",
      memberSince: "Sep 28, 2025",
      onlineLast: "2 minutes ago",
    },
    {
      id: "3",
      userId: "366g...fjhsgt",
      name: "Natasha Brown",
      email: "Natasha@FIU.edu.co",
      interests: ["Ballet", "Billiards", "Yoga"],
      status: "active",
      memberSince: "Sep 28, 2025",
      onlineLast: "3 hours ago",
      isFlagged: true,
    },
    {
      id: "4",
      userId: "466g...fjhsgt",
      name: "Nataly Taylor",
      email: "Nataly@FIU.edu.co",
      interests: ["Ballet", "Billiards", "Dance"],
      status: "active",
      memberSince: "Sep 28, 2025",
      onlineLast: "3 days ago",
    },
    {
      id: "5",
      userId: "566g...fjhsgt",
      name: "Mariana Wilson",
      email: "Mariana@FIU.edu.co",
      interests: ["Ballet", "Billiards", "Photography"],
      status: "active",
      memberSince: "Sep 28, 2025",
      onlineLast: "Oct 7, 2025",
    },
    {
      id: "6",
      userId: "489g...fjhsgt",
      name: "Andras Davis",
      email: "Andras@FIU.edu.co",
      interests: ["Ballet", "Billiards", "Music"],
      status: "active",
      memberSince: "Sep 28, 2025",
      onlineLast: "Oct 7, 2025",
    },
    {
      id: "7",
      userId: "785g...fjhsgt",
      name: "Anni Campbell",
      email: "Anni@FIU.edu.co",
      interests: ["Ballet", "Billiards", "Reading"],
      status: "active",
      memberSince: "Sep 28, 2025",
      onlineLast: "Oct 7, 2025",
    },
    {
      id: "8",
      userId: "514g...fjhsgt",
      name: "Arturo Díaz",
      email: "Arturo@FIU.edu.co",
      interests: ["Ballet", "Billiards", "Cooking"],
      status: "active",
      memberSince: "Sep 28, 2025",
      onlineLast: "Oct 7, 2025",
    },
    {
      id: "9",
      userId: "212g...fjhsgt",
      name: "Becky Gordon",
      email: "Becky@FIU.edu.co",
      interests: ["Ballet", "Billiards", "Gaming"],
      status: "active",
      memberSince: "Sep 28, 2025",
      onlineLast: "Oct 7, 2025",
    },
    {
      id: "10",
      userId: "244g...fjhsgt",
      name: "Ben Harris",
      email: "Ben@FIU.edu.co",
      interests: ["Ballet", "Billiards", "Sports"],
      status: "active",
      memberSince: "Sep 28, 2025",
      onlineLast: "Oct 7, 2025",
    },
  ];

  const filteredStudents = mockStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / entriesPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleExport = () => {
    console.log("Export clicked");
  };

  const handleStudentClick = (student: StudentData) => {
    console.log("Student clicked:", student);
  };

  const handleActionClick = (student: StudentData) => {
    console.log("Action clicked for:", student);
  };

  return (
    <main className="active-students-page">
      <div className="active-students-stats">
        <StatsCard
          title="Total students"
          value="264"
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
          value="261"
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
          <ExportButton onClick={handleExport} />
        </div>

        <StudentTable
          students={paginatedStudents}
          onStudentClick={handleStudentClick}
          onActionClick={handleActionClick}
        />

        <div className="active-students-pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={filteredStudents.length}
            entriesPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </main>
  );
};
