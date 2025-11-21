import React, { useState } from "react";
import { AssetIcon } from "../../../components-v2";
import { ExportButton } from "../../../components-v2/ExportButton/ExportButton";
import { StatsCard } from "../components/StatsCard";
import { Pagination } from "../components/Pagination";
import { StudentTable, StudentData } from "../components/StudentTable";
import "./BannedStudents.css";

export const BannedStudents: React.FC = () => {
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
      status: "banned" as const,
      memberSince: "Sep 28, 2025",
      onlineLast: "Active now",
      bannedDate: "Sep 28, 2025",
      bannedBy: "Admin User",
      bannedByEmail: "admin@FIU.edu.co",
      bannedTime: "12:14",
      reason: "Inappropriate behavior",
      duration: "Permanent",
      avatar: "A",
      areaOfStudy: "Applied Math & Physics",
      lastLogin: "Oct 20, 2025",
      totalPeers: 5,
      bio: "I like gaming with my friends while eating cheetos",
      interests: [
        "Ballet",
        "Billiards",
        "Pickleball",
        "Volleyball",
        "Golf",
        "Football",
        "Hockey",
        "Swimming",
      ],
      banHistory: [
        {
          title: "3 Day ban",
          duration: "3 Days",
          expiresIn: "Expires in about 20 hours",
          reason: "Spam",
          bannedDate: "Oct 07, 2025",
          bannedTime: "12:14",
          bannedBy: "Admin Name",
        },
        {
          title: "3 Day ban",
          duration: "3 Days",
          reason: "Spam",
          bannedDate: "Oct 07, 2025",
          bannedTime: "12:14",
          bannedBy: "Admin Name",
        },
      ],
      blockedByUsers: [
        {
          id: "1",
          name: "Ben",
          avatar: "B",
          date: "Oct 7, 2025",
          time: "12:45",
        },
        {
          id: "2",
          name: "Leo",
          avatar: "L",
          date: "Oct 7, 2025",
          time: "12:45",
        },
        {
          id: "3",
          name: "Mariana",
          avatar: "M",
          date: "Oct 7, 2025",
          time: "12:45",
        },
      ],
      reportHistory: [
        {
          reportedIdea: "Children's App",
          reportId: "166g...fjhsgt",
          reason: "Intellectual property",
          description: "Review the idea because it is the topic of my thesis.",
          reportedDate: "March 07, 2025",
          reportedTime: "12:14",
          reportedBy: "Jackie Smith",
          status: "Pending" as const,
        },
        {
          reportedIdea: "Children's App",
          reportId: "166g...fjhsgt",
          reason: "Intellectual property",
          description: "Review the idea because it is the topic of my thesis.",
          reportedDate: "March 07, 2025",
          reportedTime: "12:14",
          reportedBy: "Jackie Smith",
          status: "Resolved" as const,
        },
      ],
    },
    {
      id: "2",
      userId: "266g...fjhsgt",
      name: "Leo Johnson",
      email: "Leo@FIU.edu.co",
      status: "banned" as const,
      memberSince: "Sep 25, 2025",
      onlineLast: "2 minutes ago",
      bannedDate: "Sep 25, 2025",
      bannedBy: "Admin User",
      reason: "Spam content",
      duration: "30 days",
      avatar: "L",
    },
    {
      id: "3",
      userId: "366g...fjhsgt",
      name: "Natasha Brown",
      email: "Natasha@FIU.edu.co",
      status: "banned" as const,
      memberSince: "Sep 20, 2025",
      onlineLast: "3 hours ago",
      bannedDate: "Sep 20, 2025",
      bannedBy: "Moderator",
      reason: "Harassment",
      duration: "Permanent",
      avatar: "N",
    },
    {
      id: "4",
      userId: "466g...fjhsgt",
      name: "Nataly Taylor",
      email: "Nataly@FIU.edu.co",
      status: "banned" as const,
      memberSince: "Sep 15, 2025",
      onlineLast: "3 days ago",
      bannedDate: "Sep 15, 2025",
      bannedBy: "Admin User",
      reason: "Multiple violations",
      duration: "90 days",
      avatar: "N",
    },
    {
      id: "5",
      userId: "566g...fjhsgt",
      name: "Marcus Davis",
      email: "Marcus@FIU.edu.co",
      status: "banned" as const,
      memberSince: "Sep 10, 2025",
      onlineLast: "1 week ago",
      bannedDate: "Sep 10, 2025",
      bannedBy: "Admin User",
      reason: "Inappropriate content",
      duration: "Permanent",
      avatar: "M",
    },
  ];

  // Duplicate data to reach 42 total students
  const allStudents: StudentData[] = Array.from({ length: 42 }, (_, i) => ({
    ...mockStudents[i % mockStudents.length],
    id: `${i + 1}`,
    userId: `${100 + i}g...fjhsgt`,
  }));

  // Filter students based on search query
  const filteredStudents = allStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.reason &&
        student.reason.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  const handleExport = () => {
    console.log("Export banned students data");
  };

  const handleStudentClick = (student: StudentData) => {
    console.log("Student clicked:", student);
  };

  const handleActionClick = (student: StudentData) => {
    console.log("Action clicked for:", student);
  };

  return (
    <div className="banned-students-page">
      <div className="banned-students-stats">
        <StatsCard
          title="Total banned students"
          value="42"
          iconName="lock-icon"
          iconBgColor="#FFEBEE"
          trend={{
            value: "12%",
            isPositive: false,
            label: "from last month",
          }}
        />
        <StatsCard
          title="Permanent bans"
          value="28"
          iconName="lock-icon"
          iconBgColor="#FFF3E0"
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
            <div className="banned-students-search">
              <AssetIcon name="search-icon" size={24} className="search-icon" />
              <input
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
            "bannedDate",
            "bannedBy",
            "reason",
            "duration",
          ]}
          onStudentClick={handleStudentClick}
          onActionClick={handleActionClick}
        />

        <div className="banned-students-pagination">
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
