import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../API";
import "./Campuses.css";
import {
  AssetIcon,
  CopyableId,
  Divider,
  Pagination,
} from "../../../components-v2";
import { useTheme } from "../../../hooks/useTheme";
import CampusBoundary from "../../CampusBoundary/CampusBoundary";

interface CampusData {
  id: string;
  name: string;
  campusId: string;
  location: string;
  address: string;
  status: "Active" | "Inactive";
  imageUrl: string;
  boundaryData?: {
    geometry: {
      type: string;
      coordinates: number[][][];
    };
  } | null;
}

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const Campuses: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, _setSearchQuery] = useState("");
  const [expandedCampusId, setExpandedCampusId] = useState<string | null>(null);
  const [currentPage] = useState(1);

  const { data: campusesData, isLoading } = useQuery({
    queryKey: ["campuses"],
    queryFn: () => apiClient.api.adminV2CampusesList(),
  });

  const campuses: CampusData[] = (campusesData?.data || []).map(
    (campus: any) => ({
      id: campus.id,
      name: campus.name,
      campusId: campus.id, // Using ID as campusId for display
      location: campus.location,
      address: campus.address,
      status: campus.status as "Active" | "Inactive",
      imageUrl: campus.imageUrl,
      boundaryData: campus.boundaryData,
    })
  );

  const filteredCampuses = campuses.filter((campus) => {
    const matchesSearch = campus.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalCampuses = campuses.length;

  const renderSkeletonRows = () =>
    Array.from({ length: 6 }).map((_, index) => (
      <React.Fragment key={`campus-skeleton-${index}`}>
        <tr className="campus-row skeleton-row">
          <td className="campus-cell">
            <div className="campus-info">
              <div className="skeleton-block skeleton-avatar" />
              <div className="skeleton-stack">
                <div className="skeleton-block skeleton-line" />
                <div className="skeleton-block skeleton-line short" />
              </div>
            </div>
          </td>
          <td className="campus-id-cell">
            <div className="skeleton-block skeleton-pill" />
          </td>
          <td>
            <div className="skeleton-block skeleton-line" />
          </td>
          <td>
            <div className="skeleton-block skeleton-line wide" />
          </td>
          <td>
            <div className="skeleton-block skeleton-badge" />
          </td>
          <td>
            <div className="skeleton-block skeleton-action" />
          </td>
        </tr>
        {index < 5 && (
          <tr className="campus-divider-row">
            <td colSpan={6}>
              <Divider />
            </td>
          </tr>
        )}
      </React.Fragment>
    ));

  const handleToggleExpand = (campusId: string) => {
    if (expandedCampusId === campusId) {
      setExpandedCampusId(null);
    } else {
      setExpandedCampusId(campusId);
    }
  };

  return (
    <main className="campuses-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Campus Management</h1>
        <p className="page-subtitle">
          Manage university campuses, boundaries, and location data
        </p>
      </div>

      {/* Main Content Container */}
      <div className={`campuses-container ${theme.isDark ? "dark-mode" : ""}`}>
        {/* Directory Info */}
        <div className="directory-info">
          <h2 className="directory-title">Campus directory</h2>
          <p className="directory-count">{totalCampuses} campuses configured</p>
        </div>

        {/* Table Container */}
        <div className="campuses-table-wrapper">
          <table className="campuses-table">
            <thead>
              <tr className="table-header-row">
                <th className="table-header">Campus</th>
                <th className="table-header">ID</th>
                <th className="table-header">Location</th>
                <th className="table-header">Address</th>
                <th className="table-header">Status</th>
                <th className="table-header">Sync places</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? renderSkeletonRows()
                : filteredCampuses.map((campus, index) => (
                    <React.Fragment key={campus.id}>
                      <tr className="campus-row">
                        {/* Campus Column with Avatar and Dropdown */}
                        <td className="campus-cell">
                          <div className="campus-info">
                            {campus.imageUrl ? (
                              <img
                                src={campus.imageUrl}
                                alt={campus.name}
                                className="campus-avatar"
                              />
                            ) : (
                              <div className="campus-avatar-placeholder">
                                {getInitials(campus.name)}
                              </div>
                            )}
                            <div className="campus-dropdown">
                              <button
                                data-testid="campus-dropdown-btn"
                                className="dropdown-button"
                                onClick={() => handleToggleExpand(campus.id)}
                              >
                                <AssetIcon
                                  name="arrow-down"
                                  size={10}
                                  className={`chevron-icon ${
                                    expandedCampusId === campus.id
                                      ? "expanded"
                                      : ""
                                  }`}
                                />
                                <span className="campus-name">
                                  {campus.name}
                                </span>
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* ID Column */}
                        <td className="campus-id-cell">
                          <CopyableId
                            id={campus.campusId}
                            label="Campus ID"
                            variant="primary"
                            testId="copy-campus-id"
                          />
                        </td>

                        {/* Location Column */}
                        <td className="campus-location">{campus.location}</td>

                        {/* Address Column */}
                        <td className="campus-address">{campus.address}</td>

                        {/* Status Column */}
                        <td className="campus-status">
                          <span
                            className={`status-badge ${campus.status.toLowerCase()}`}
                          >
                            {campus.status}
                          </span>
                        </td>

                        {/* Sync Column */}
                        <td className="campus-sync">
                          <button
                            data-testid="sync-places-btn"
                            className="sync-button"
                            title="Sync places"
                            aria-label="Sync places for campus"
                          >
                            <AssetIcon name="swap-arrows-icon" size={16} />
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Boundary Row */}
                      {expandedCampusId === campus.id && (
                        <tr className="boundary-row">
                          <td colSpan={6} className="boundary-cell">
                            <div className="boundary-map">
                              <CampusBoundary
                                readOnly={true}
                                initialBoundaryData={campus.boundaryData}
                                onBoundaryChange={() => {
                                  // Read-only mode
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                      {index < filteredCampuses.length - 1 && (
                        <tr className="campus-divider-row">
                          <td colSpan={6}>
                            <Divider />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCampuses / 10)}
          totalEntries={totalCampuses}
          entriesPerPage={10}
          onPageChange={() => {}}
        />
      </div>
    </main>
  );
};
