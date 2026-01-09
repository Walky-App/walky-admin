import React, { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import {
  SearchInput,
  Pagination,
  NoData,
  FilterDropdown,
} from "../../../components-v2";
import { useDebounce } from "../../../hooks/useDebounce";
import { SpaceTable } from "../components/SpaceTable/SpaceTable";
import { SpaceTableSkeleton } from "../components/SpaceTableSkeleton/SpaceTableSkeleton";
import { useSchool } from "../../../contexts/SchoolContext";
import { useCampus } from "../../../contexts/CampusContext";
import "./SpacesManager.css";

interface SpaceCategory {
  _id: string;
  name: string;
  order?: number;
}

export type SpaceSortField =
  | "spaceName"
  | "members"
  | "events"
  | "creationDate";

export const SpacesManager: React.FC = () => {
  const { selectedSchool } = useSchool();
  const { selectedCampus } = useCampus();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };
  const [sortBy, setSortBy] = useState<SpaceSortField | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch categories dynamically
  const { data: categoriesData } = useQuery({
    queryKey: ["spaceCategories"],
    queryFn: () => apiClient.api.adminSpaceCategoriesList(),
  });

  // Sort categories alphabetically by name
  const categories: SpaceCategory[] = React.useMemo(() => {
    // Handle different response structures: { data: [...] } or { data: { data: [...] } }
    // Note: API returns void but actually sends array data
    const responseData = categoriesData?.data as
      | SpaceCategory[]
      | { data?: SpaceCategory[] }
      | undefined;
    const cats: SpaceCategory[] = Array.isArray(responseData)
      ? responseData
      : Array.isArray(responseData?.data)
      ? responseData.data
      : [];
    return [...cats].sort((a, b) => a.name.localeCompare(b.name));
  }, [categoriesData]);

  // Helper to convert category name to slug (e.g., "Club Sports" -> "club-sports")
  const toSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");

  const categoryOptions = React.useMemo(
    () => [
      { value: "all", label: "All categories" },
      ...categories.map((cat) => ({
        value: toSlug(cat.name),
        label: cat.name,
      })),
    ],
    [categories]
  );

  const { data: spacesData, isLoading } = useQuery({
    queryKey: [
      "spaces",
      currentPage,
      debouncedSearchQuery,
      categoryFilter,
      sortBy,
      sortOrder,
      selectedSchool?._id,
      selectedCampus?._id,
    ],
    queryFn: () =>
      apiClient.api.adminV2SpacesList({
        page: currentPage,
        limit: 10,
        search: debouncedSearchQuery,
        category: categoryFilter,
        sortBy,
        sortOrder,
        schoolId: selectedSchool?._id,
        campusId: selectedCampus?._id,
      }),
    placeholderData: keepPreviousData,
  });

  const handleSortChange = (field: SpaceSortField, order: "asc" | "desc") => {
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  const filteredSpaces = (spacesData?.data.data || []).map((space) => {
    const rawTimestamp =
      `${space.creationDate || ""} ${space.creationTime || ""}`.trim() ||
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
      id: space.id || "",
      spaceName: space.spaceName || "",
      owner: {
        name: space.owner?.name || "",
        avatar: space.owner?.avatar || "",
      },
      studentId: space.studentId || "",
      events: space.events || 0,
      members: space.members || 0,
      creationDate: creationDate || "",
      creationTime: creationTime || "",
      category: space.category || "",
      isFlagged: space.isFlagged,
      flagReason: space.flagReason,
    };
  });

  // Local sort fallback for fields the API cannot sort (e.g., events)
  const displayedSpaces = React.useMemo(() => {
    if (sortBy === "events") {
      return [...filteredSpaces].sort((a, b) =>
        sortOrder === "asc" ? a.events - b.events : b.events - a.events
      );
    }
    return filteredSpaces;
  }, [filteredSpaces, sortBy, sortOrder]);

  const totalPages = Math.ceil((spacesData?.data.total || 0) / 10);
  const totalEntries = spacesData?.data.total || 0;
  const isEmpty = !isLoading && filteredSpaces.length === 0;

  return (
    <main className="spaces-manager-container">
      <div className="spaces-manager-header">
        <div className="spaces-manager-title-section">
          <h1 className="spaces-manager-title">Spaces management</h1>
          <p className="spaces-manager-subtitle">
            Manage different spaces for students to connect on campus.
          </p>
        </div>
      </div>

      <div className="spaces-manager-content">
        <div className="spaces-list-header">
          <h2 className="spaces-list-title">List of Spaces</h2>

          <div className="spaces-filters">
            <SearchInput
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search"
              variant="secondary"
            />

            <FilterDropdown
              value={categoryFilter}
              onChange={(val) => {
                setCategoryFilter(val);
                setCurrentPage(1);
              }}
              options={categoryOptions}
              placeholder="All categories"
              width="200px"
              testId="category-filter"
              ariaLabel="Filter by category"
            />
          </div>
        </div>

        {isLoading ? (
          <SpaceTableSkeleton />
        ) : (
          <>
            <div style={{ opacity: isEmpty ? 0.4 : 1 }}>
              <SpaceTable
                spaces={displayedSpaces}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
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
