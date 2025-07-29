import React from "react";
import { Place } from "../types/place";
import ExpandablePlaceRow from "./ExpandablePlaceRow";

interface PlacesListProps {
  places: Place[];
  total: number;
  page: number;
  pages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onPlaceUpdate: () => void;
  onAlert: (alert: { type: "success" | "danger" | "info"; message: string }) => void;
}

const PlacesListRadix: React.FC<PlacesListProps> = ({
  places,
  total,
  page,
  pages,
  limit,
  onPageChange,
  onAlert,
}) => {
  const renderPagination = () => {
    const items = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(pages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      items.push(
        <button
          key="first"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          First
        </button>
      );
    }

    for (let i = start; i <= end; i++) {
      items.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 text-sm border rounded ${
            i === page
              ? "bg-blue-500 text-white border-blue-500"
              : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }

    if (end < pages) {
      items.push(
        <button
          key="last"
          onClick={() => onPageChange(pages)}
          disabled={page === pages}
          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Last
        </button>
      );
    }

    return items;
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-50 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Address
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Google Types
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Hierarchy
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Photos
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {places.map((place) => (
              <ExpandablePlaceRow
                key={place._id}
                place={place}
                onAlert={onAlert}
              />
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} places
          </div>
          <div className="flex gap-1">{renderPagination()}</div>
        </div>
      )}
    </>
  );
};

export default PlacesListRadix;