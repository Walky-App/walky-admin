import React, { useState, useRef, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import {
  AssetIcon,
  SearchInput,
  Pagination,
  NoData,
} from "../../../components-v2";
import { SpaceTable } from "../components/SpaceTable/SpaceTable";
import { SpaceTableSkeleton } from "../components/SpaceTableSkeleton/SpaceTableSkeleton";
import "./SpacesManager.css";

interface SpaceCategory {
  _id: string;
  name: string;
  order?: number;
}

export const SpacesManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch categories dynamically
  const { data: categoriesData } = useQuery({
    queryKey: ["spaceCategories"],
    queryFn: () => apiClient.api.adminSpaceCategoriesList(),
  });

  // Sort categories alphabetically by name
  const categories: SpaceCategory[] = React.useMemo(() => {
    // Handle different response structures: { data: [...] } or { data: { data: [...] } }
    const responseData = categoriesData?.data;
    const cats: SpaceCategory[] = Array.isArray(responseData)
      ? responseData
      : Array.isArray((responseData as any)?.data)
        ? (responseData as any).data
        : [];
    return [...cats].sort((a, b) => a.name.localeCompare(b.name));
  }, [categoriesData]);

  // Helper to convert category name to slug (e.g., "Club Sports" -> "club-sports")
  const toSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");

  // Helper to get display name from current filter
  const getFilterDisplayName = () => {
    if (categoryFilter === "all") return "All categories";
    const cat = categories.find((c) => toSlug(c.name) === categoryFilter);
    return cat?.name || categoryFilter;
  };

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
    placeholderData: keepPreviousData,
  });

  const filteredSpaces = (spacesData?.data.data || []).map((space: any) => {
    const rawTimestamp =
      space.createdAt ||
      `${space.creationDate} ${space.creationTime}` ||
      space.creationDate;
    const parsed = rawTimestamp ? Date.parse(rawTimestamp) : NaN;
    const dateObj = Number.isNaN(parsed) ? null : new Date(parsed);

    const creationDate = dateObj
      ? dateObj.toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : space.creationDate;

    const creationTime = dateObj
      ? dateObj.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : space.creationTime;

    return {
      id: space.id,
      spaceName: space.spaceName,
      owner: space.owner,
      studentId: space.studentId,
      events: space.events,
      members: space.members,
      creationDate,
      creationTime,
      createdAt: dateObj ? dateObj.toISOString() : space.createdAt,
      category: space.category,
      isFlagged: space.isFlagged,
      flagReason: space.flagReason,
    };
  });

  const totalPages = Math.ceil((spacesData?.data.total || 0) / 10);
  const totalEntries = spacesData?.data.total || 0;
  const isEmpty = !isLoading && filteredSpaces.length === 0;

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
                <span>{getFilterDisplayName()}</span>
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
                    All categories
                  </div>
                  {categories.map((cat) => (
                    <React.Fragment key={cat._id}>
                      <div className="category-dropdown-divider" />
                      <div
                        className={`category-dropdown-item ${
                          categoryFilter === toSlug(cat.name) ? "active" : ""
                        }`}
                        onClick={() => {
                          setCategoryFilter(toSlug(cat.name));
                          setCategoryDropdownOpen(false);
                        }}
                      >
                        {cat.name}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <SpaceTableSkeleton />
        ) : (
          <>
            <div style={{ opacity: isEmpty ? 0.4 : 1 }}>
              <SpaceTable spaces={filteredSpaces} />
            </div>
            {isEmpty && (
              <NoData
                iconName="space-icon"
                iconColor="#526AC9"
                iconSize={40}
                message="No spaces found"
              />
            )}
          </>
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
