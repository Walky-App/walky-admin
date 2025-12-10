import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import { AssetIcon, Pagination, SearchInput } from "../../../components-v2";
import SkeletonLoader from "../../../components/SkeletonLoader";

const SpacesManagerSkeleton = () => (
  <main className="spaces-manager-container">
    <div className="spaces-manager-header">
      <div className="spaces-manager-title-section">
        <SkeletonLoader width="250px" height="32px" />
        <SkeletonLoader width="400px" height="18px" className="mt-2" />
      </div>
    </div>

    <div className="spaces-manager-content">
      <div className="spaces-list-header">
        <h2 className="spaces-list-title">
          <SkeletonLoader width="150px" height="24px" />
        </h2>

        <div className="spaces-filters">
          <SkeletonLoader width="300px" height="40px" borderRadius="12px" />
          <SkeletonLoader width="180px" height="40px" borderRadius="12px" />
        </div>
      </div>

      <div className="space-table-wrapper">
        <table className="space-table">
          <thead>
            <tr>
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <th key={i}>
                  <SkeletonLoader width="80px" height="20px" />
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <div className="content-space-divider" />
          <tbody>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <tr key={i}>
                <td>
                  <SkeletonLoader width="120px" height="20px" />
                </td>
                <td>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <SkeletonLoader width="32px" height="32px" borderRadius="50%" />
                    <SkeletonLoader width="100px" height="20px" />
                  </div>
                </td>
                <td>
                  <SkeletonLoader width="80px" height="20px" borderRadius="12px" />
                </td>
                <td>
                  <SkeletonLoader width="40px" height="24px" borderRadius="16px" />
                </td>
                <td>
                  <SkeletonLoader width="40px" height="24px" borderRadius="16px" />
                </td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <SkeletonLoader width="90px" height="16px" />
                    <SkeletonLoader width="60px" height="14px" />
                  </div>
                </td>
                <td>
                  <SkeletonLoader width="100px" height="24px" borderRadius="16px" />
                </td>
                <td>
                  <SkeletonLoader width="24px" height="24px" borderRadius="4px" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </main>
);

import { SpaceTable } from "../components/SpaceTable/SpaceTable";
import { SpaceTableSkeleton } from "../components/SpaceTableSkeleton/SpaceTableSkeleton";
import { NoSpacesFound } from "../components/NoSpacesFound/NoSpacesFound";
import "./SpacesManager.css";

export const SpacesManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { data: spacesData, isLoading } = useQuery({
    queryKey: ["spaces", currentPage, searchQuery, categoryFilter],
    queryFn: () =>
      apiClient.api.adminV2SpacesList({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        category: categoryFilter,
      }),
  });

  const filteredSpaces = (spacesData?.data.data || []).map((space: any) => ({
    id: space.id,
    spaceName: space.spaceName,
    owner: space.owner,
    studentId: space.studentId,
    events: space.events,
    members: space.members,
    creationDate: space.creationDate,
    creationTime: space.creationTime,
    category: space.category,
    isFlagged: space.isFlagged,
    flagReason: space.flagReason,
  }));

  const totalPages = Math.ceil((spacesData?.data.total || 0) / 10);
  const totalEntries = spacesData?.data.total || 0;

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <main className="spaces-manager-container">
      <div className="spaces-manager-header">
        <div className="spaces-manager-title-section">
          <h1 className="spaces-manager-title">Spaces management</h1>
          <p className="spaces-manager-subtitle">
            Manage and create different spaces for students to connect on
            campus.
          </p>
        </div>
      </div>

      <div className="spaces-manager-content">
        <div className="spaces-list-header">
          <h2 className="spaces-list-title">List of Spaces</h2>

          <div className="spaces-filters">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search"
              variant="secondary"
            />

            <div className="category-filter-dropdown" ref={dropdownRef}>
              <button
                data-testid="category-filter-btn"
                className="category-filter-button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              >
                <span>
                  {categoryFilter === "all"
                    ? "All categorys"
                    : categoryFilter === "clubs"
                    ? "Clubs"
                    : categoryFilter === "club-sports"
                    ? "Club Sports"
                    : categoryFilter === "im-teams"
                    ? "IM Teams"
                    : categoryFilter === "sororities"
                    ? "Sororities"
                    : categoryFilter === "fraternities"
                    ? "Fraternities"
                    : categoryFilter === "volunteer"
                    ? "Volunteer"
                    : categoryFilter === "academics"
                    ? "Academics & Honors"
                    : categoryFilter === "leadership"
                    ? "Leadership & Government"
                    : "Cultural & Diversity"}
                </span>
                <AssetIcon name="arrow-down" size={10} color="#5B6168" />
              </button>
              {categoryDropdownOpen && (
                <div className="category-dropdown-menu">
                  <div
                    className={`category-dropdown-item ${
                      categoryFilter === "all" ? "active" : ""
                    }`}
                    onClick={() => {
                      setCategoryFilter("all");
                      setCategoryDropdownOpen(false);
                    }}
                  >
                    All Categorys
                  </div>
                  <div className="category-dropdown-divider" />
                  <div
                    className="category-dropdown-item"
                    onClick={() => {
                      setCategoryFilter("clubs");
                      setCategoryDropdownOpen(false);
                    }}
                  >
                    Clubs
                  </div>
                  <div className="category-dropdown-divider" />
                  <div
                    className="category-dropdown-item"
                    onClick={() => {
                      setCategoryFilter("club-sports");
                      setCategoryDropdownOpen(false);
                    }}
                  >
                    Club Sports
                  </div>
                  <div className="category-dropdown-divider" />
                  <div
                    className="category-dropdown-item"
                    onClick={() => {
                      setCategoryFilter("im-teams");
                      setCategoryDropdownOpen(false);
                    }}
                  >
                    IM Teams
                  </div>
                  <div className="category-dropdown-divider" />
                  <div
                    className="category-dropdown-item"
                    onClick={() => {
                      setCategoryFilter("sororities");
                      setCategoryDropdownOpen(false);
                    }}
                  >
                    Sororities
                  </div>
                  <div className="category-dropdown-divider" />
                  <div
                    className="category-dropdown-item"
                    onClick={() => {
                      setCategoryFilter("fraternities");
                      setCategoryDropdownOpen(false);
                    }}
                  >
                    Fraternities
                  </div>
                  <div className="category-dropdown-divider" />
                  <div
                    className="category-dropdown-item"
                    onClick={() => {
                      setCategoryFilter("volunteer");
                      setCategoryDropdownOpen(false);
                    }}
                  >
                    Volunteer
                  </div>
                  <div className="category-dropdown-divider" />
                  <div
                    className="category-dropdown-item"
                    onClick={() => {
                      setCategoryFilter("academics");
                      setCategoryDropdownOpen(false);
                    }}
                  >
                    Academics & Honors
                  </div>
                  <div className="category-dropdown-divider" />
                  <div
                    className="category-dropdown-item"
                    onClick={() => {
                      setCategoryFilter("leadership");
                      setCategoryDropdownOpen(false);
                    }}
                  >
                    Leadership & Government
                  </div>
                  <div className="category-dropdown-divider" />
                  <div
                    className="category-dropdown-item"
                    onClick={() => {
                      setCategoryFilter("cultural");
                      setCategoryDropdownOpen(false);
                    }}
                  >
                    Cultural & Diversity
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <SpaceTableSkeleton />
        ) : filteredSpaces.length === 0 ? (
          <NoSpacesFound message="No spaces found" />
        ) : (
          <SpaceTable spaces={filteredSpaces} />
        )}

        {!isLoading && filteredSpaces.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={totalEntries}
            entriesPerPage={10}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </main>
  );
};
