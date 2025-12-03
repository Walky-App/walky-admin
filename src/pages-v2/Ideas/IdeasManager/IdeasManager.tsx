import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import "./IdeasManager.css";
import { IdeasTable } from "../components/IdeasTable/IdeasTable";
import { SearchInput } from "../../../components-v2";

export const IdeasManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: ideasData, isLoading } = useQuery({
    queryKey: ['ideas', currentPage, searchQuery],
    queryFn: () => apiClient.api.adminV2IdeasList({ page: currentPage, limit: 10, search: searchQuery }),
  });

  const filteredIdeas = (ideasData?.data.data || []).map((idea: any) => ({
    id: idea.id,
    ideaTitle: idea.ideaTitle,
    owner: idea.owner,
    studentId: idea.studentId,
    collaborated: idea.collaborated,
    creationDate: idea.creationDate,
    creationTime: idea.creationTime,
    isFlagged: idea.isFlagged,
    flagReason: idea.flagReason,
  }));

  const totalPages = Math.ceil((ideasData?.data.total || 0) / 10);
  const startEntry = (currentPage - 1) * 10 + 1;
  const totalEntries = ideasData?.data.total || 0;

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

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
                  onChange={setSearchQuery}
                  placeholder="Search"
                  variant="secondary"
                />
              </div>
            </div>
          </div>

          <div className="ideas-manager-table-container">
            <IdeasTable ideas={filteredIdeas} />
          </div>

          <div className="ideas-manager-pagination">
            <p className="ideas-manager-pagination-info">
              Showing {startEntry} of {totalEntries} entries
            </p>
            <div className="ideas-manager-pagination-controls">
              <button
                data-testid="pagination-prev-btn"
                className="ideas-manager-pagination-button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <button
                data-testid="pagination-page-btn"
                className="ideas-manager-pagination-page active"
              >
                {currentPage}
              </button>
              <button
                data-testid="pagination-next-btn"
                className="ideas-manager-pagination-button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
