import React, { useState } from "react";
import { AssetIcon } from "../../components-v2";
import { IdeasTable, IdeaData } from "./components/IdeasTable";
import "./IdeasManager.css";

// Mock data - replace with API call
const mockIdeas: IdeaData[] = [
  {
    id: "1",
    ideaTitle: "Children's Application",
    owner: {
      name: "Becky",
      avatar:
        "https://www.figma.com/api/mcp/asset/ad6fd3e4-fd5c-4025-b613-e25336e7ceda",
    },
    studentId: "166g...fjhsgt",
    collaborated: 10,
    creationDate: "Oct 7, 2025",
    creationTime: "12:45",
  },
  {
    id: "2",
    ideaTitle: "Form a Band",
    owner: {
      name: "Jackie",
      avatar:
        "https://www.figma.com/api/mcp/asset/57cdf5bf-3b9a-44e6-9bf1-0dcc9a5929f1",
    },
    studentId: "166g...fjhsgt",
    collaborated: 8,
    creationDate: "Oct 7, 2025",
    creationTime: "12:45",
  },
  {
    id: "3",
    ideaTitle: "Language Exchange",
    owner: {
      name: "Mariana",
      avatar:
        "https://www.figma.com/api/mcp/asset/2787b2ef-9d4e-400a-a571-0d9e810469d7",
    },
    studentId: "166g...fjhsgt",
    collaborated: 3,
    creationDate: "Oct 7, 2025",
    creationTime: "12:45",
  },
];

export const IdeasManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredIdeas = mockIdeas.filter((idea) => {
    const matchesSearch = idea.ideaTitle
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredIdeas.length / 10);
  const startEntry = (currentPage - 1) * 10 + 1;

  return (
    <div className="ideas-manager-container">
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
                <div className="ideas-manager-search-input">
                  <AssetIcon name="search-icon" size={24} color="#676D70" />
                  <input
                    data-testid="search-input"
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="ideas-manager-table-container">
            <IdeasTable ideas={filteredIdeas} />
          </div>

          <div className="ideas-manager-pagination">
            <p className="ideas-manager-pagination-info">
              Showing {startEntry} of {filteredIdeas.length} entries
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
    </div>
  );
};
