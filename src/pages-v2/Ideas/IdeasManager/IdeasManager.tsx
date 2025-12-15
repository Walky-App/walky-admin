import React, { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import "./IdeasManager.css";
import { IdeasTable } from "../components/IdeasTable/IdeasTable";
import { IdeasTableSkeleton } from "../components/IdeasTableSkeleton/IdeasTableSkeleton";
import { SearchInput, Pagination, NoData } from "../../../components-v2";

export type IdeaSortField = "ideaTitle" | "collaborated" | "creationDate";

export const IdeasManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };
  const [sortBy, setSortBy] = useState<IdeaSortField | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data: ideasData, isLoading } = useQuery({
    queryKey: ["ideas", currentPage, searchQuery, sortBy, sortOrder],
    queryFn: () =>
      apiClient.api.adminV2IdeasList({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        sortBy,
        sortOrder,
      }),
    placeholderData: keepPreviousData,
  });

  const handleSortChange = (field: IdeaSortField, order: "asc" | "desc") => {
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  const filteredIdeas = (ideasData?.data.data || []).map((idea) => {
    const rawTimestamp =
      `${idea.creationDate || ""} ${idea.creationTime || ""}`.trim() ||
      idea.creationDate;
    const parsed = rawTimestamp ? Date.parse(rawTimestamp) : NaN;
    const dateObj = Number.isNaN(parsed) ? null : new Date(parsed);

    const creationDate = dateObj
      ? dateObj.toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : idea.creationDate;

    const creationTime = dateObj
      ? dateObj.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : idea.creationTime;

    return {
      id: idea.id || "",
      ideaTitle: idea.ideaTitle || "",
      owner: {
        name: idea.owner?.name || "",
        avatar: idea.owner?.avatar || "",
      },
      studentId: idea.studentId || "",
      collaborated: idea.collaborated || 0,
      creationDate: creationDate || "",
      creationTime: creationTime || "",
      isFlagged: idea.isFlagged,
      flagReason: idea.flagReason,
    };
  });

  const totalPages = Math.ceil((ideasData?.data.total || 0) / 10);
  const totalEntries = ideasData?.data.total || 0;
  const isEmpty = !isLoading && filteredIdeas.length === 0;

  return (
    <main className="ideas-manager-container">
      <div className="ideas-manager-header">
        <div className="ideas-manager-title-section">
          <h1 className="ideas-manager-title">Ideas management</h1>
          <p className="ideas-manager-subtitle">
            Manage and review student ideas to foster innovation and community
            growth.
          </p>
        </div>
      </div>

      <div className="ideas-manager-content">
        <div className="ideas-manager-list-section">
          <div className="ideas-manager-list-header">
            <h2 className="ideas-manager-list-title">List of Ideas</h2>
            <div className="ideas-manager-filters">
              <div className="ideas-manager-search">
                <SearchInput
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search"
                  variant="secondary"
                />
              </div>
            </div>
          </div>

          <div className="ideas-manager-table-container">
            {isLoading ? (
              <IdeasTableSkeleton />
            ) : (
              <>
                <div style={{ opacity: isEmpty ? 0.4 : 1 }}>
                  <IdeasTable
                    ideas={filteredIdeas}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSortChange={handleSortChange}
                  />
                </div>
                {isEmpty && (
                  <NoData
                    iconName="ideia-icon"
                    iconColor="#526AC9"
                    iconSize={40}
                    message="No ideas found"
                  />
                )}
              </>
            )}
          </div>

          {!isLoading && filteredIdeas.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalEntries={totalEntries}
              entriesPerPage={10}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </main>
  );
};
