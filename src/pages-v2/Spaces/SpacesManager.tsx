import React, { useState, useRef, useEffect } from "react";
import { AssetIcon, SearchInput } from "../../components-v2";
import { SpaceTable, SpaceData } from "./components/SpaceTable";
import "./SpacesManager.css";

// Mock data - replace with API call
const mockSpaces: SpaceData[] = [
  {
    id: "1",
    spaceName: "Honduras Club",
    owner: {
      name: "Becky",
      avatar:
        "https://www.figma.com/api/mcp/asset/98913cc9-2a1e-4c0d-a65f-dcc8042102ba",
    },
    studentId: "166g...fjhsgt",
    events: 1,
    members: 6,
    creationDate: "Oct 7, 2025",
    creationTime: "12:45",
    category: "clubs",
  },
  {
    id: "2",
    spaceName: "Pi Lambda Phi",
    owner: {
      name: "Jackie",
      avatar:
        "https://www.figma.com/api/mcp/asset/f6300f43-2a73-4f74-8c0c-397c021dac02",
    },
    studentId: "166g...fjhsgt",
    events: 1,
    members: 0,
    creationDate: "Oct 7, 2025",
    creationTime: "12:45",
    category: "fraternities",
  },
  {
    id: "3",
    spaceName: "Sisters of Unity",
    owner: {
      name: "Mariana",
      avatar:
        "https://www.figma.com/api/mcp/asset/f2681962-f3fd-481e-b2bb-eedbb7cc1e8c",
    },
    studentId: "166g...fjhsgt",
    events: 1,
    members: 0,
    creationDate: "Oct 7, 2025",
    creationTime: "12:45",
    category: "sororities",
  },
];

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

  const filteredSpaces = mockSpaces.filter((space) => {
    const matchesSearch = space.spaceName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || space.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredSpaces.length / 10);

  return (
    <div className="spaces-manager-container">
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

        <SpaceTable spaces={filteredSpaces} />

        <div className="spaces-pagination">
          <p className="pagination-info">
            Showing {filteredSpaces.length} of {mockSpaces.length} entries
          </p>

          <div className="pagination-controls">
            <button
              data-testid="pagination-prev-btn"
              className="pagination-btn"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <div className="pagination-page-number active">
              <span>{currentPage}</span>
            </div>

            <button
              data-testid="pagination-next-btn"
              className="pagination-btn"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
