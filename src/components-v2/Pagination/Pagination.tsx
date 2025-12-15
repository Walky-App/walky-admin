import React from "react";
import "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  entriesPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalEntries,
  entriesPerPage,
  onPageChange,
}) => {
  const isEmpty = totalEntries === 0 || totalPages === 0;

  // Keep bounds sane when there is no data
  const startEntry = isEmpty ? 0 : (currentPage - 1) * entriesPerPage + 1;
  const endEntry = isEmpty
    ? 0
    : Math.min(currentPage * entriesPerPage, totalEntries);

  const renderPageNumbers = () => {
    const pages: Array<number | "ellipsis"> = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const lastPage = totalPages;
      pages.push(1);

      if (currentPage <= 3) {
        pages.push(2, 3, 4, "ellipsis", lastPage);
      } else if (currentPage === 4) {
        pages.push(2, 3, 4, 5, "ellipsis", lastPage);
      } else if (currentPage >= lastPage - 2) {
        pages.push(
          "ellipsis",
          lastPage - 3,
          lastPage - 2,
          lastPage - 1,
          lastPage
        );
      } else {
        pages.push(
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis",
          lastPage
        );
      }
    }

    return pages.map((page, idx) => {
      if (page === "ellipsis") {
        return (
          <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
            ...
          </span>
        );
      }

      return (
        <button
          data-testid="pagination-page-btn"
          key={page}
          className={`pagination-button pagination-number ${
            page === currentPage ? "active" : ""
          }`}
          onClick={() => onPageChange(page)}
          disabled={page === currentPage}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        {`Showing ${startEntry}-${endEntry} of ${totalEntries} entries`}
      </div>
      <div className="pagination-controls">
        <button
          data-testid="pagination-prev-btn"
          className="pagination-button pagination-prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isEmpty || currentPage === 1}
        >
          Previous
        </button>
        {!isEmpty && renderPageNumbers()}
        <button
          data-testid="pagination-next-btn"
          className="pagination-button pagination-next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isEmpty || currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};
