import React from "react";
import { useMixpanel } from "../../../hooks";
import "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  entriesPerPage: number;
  onPageChange: (page: number) => void;
  pageContext?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalEntries,
  entriesPerPage,
  onPageChange,
  pageContext = "Students",
}) => {
  const { trackEvent } = useMixpanel();
  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  const handlePageChange = (page: number) => {
    onPageChange(page);
    trackEvent(`${pageContext} - Page Changed`, {
      previous_page: currentPage,
      new_page: page,
      total_pages: totalPages,
      total_entries: totalEntries,
    });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          data-testid="pagination-page-btn"
          key={i}
          className={`pagination-button pagination-number ${
            i === currentPage ? "active" : ""
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing {startEntry}-{endEntry} of {totalEntries} entries
      </div>
      <div className="pagination-controls">
        <button
          data-testid="pagination-prev-btn"
          className="pagination-button pagination-prev"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {renderPageNumbers()}
        <button
          data-testid="pagination-next-btn"
          className="pagination-button pagination-next"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};
