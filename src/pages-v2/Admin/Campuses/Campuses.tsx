import React, { useState } from "react";
import "./Campuses.css";
import { AssetIcon } from "../../../components-v2";
import CampusBoundary from "../../../pages/CampusBoundary";

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

export const Campuses: React.FC = () => {
  const [searchQuery, _setSearchQuery] = useState("");
  const [expandedCampusId, setExpandedCampusId] = useState<string | null>(null);
  const [currentPage] = useState(1);

  // Mock data - replace with real data from API
  const mockCampuses: CampusData[] = [
    {
      id: "1",
      name: "FIU",
      campusId: "166g...fjhsgt",
      location: "Miami, FL",
      address: "11200 SW 8th St, Miami, FL 33199",
      status: "Active",
      imageUrl: "https://via.placeholder.com/38",
      boundaryData: null, // Will have real boundary data
    },
    {
      id: "2",
      name: "FIU",
      campusId: "166g...fjhsgt",
      location: "Miami, FL",
      address: "11200 SW 8th St, Miami, FL 33199",
      status: "Active",
      imageUrl: "https://via.placeholder.com/38",
      boundaryData: null,
    },
    {
      id: "3",
      name: "FIU",
      campusId: "166g...fjhsgt",
      location: "Miami, FL",
      address: "11200 SW 8th St, Miami, FL 33199",
      status: "Active",
      imageUrl: "https://via.placeholder.com/38",
      boundaryData: null,
    },
  ];

  const filteredCampuses = mockCampuses.filter((campus) => {
    const matchesSearch = campus.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleCopyCampusId = (campusId: string) => {
    navigator.clipboard.writeText(campusId);
  };

  const handleToggleExpand = (campusId: string) => {
    if (expandedCampusId === campusId) {
      setExpandedCampusId(null);
    } else {
      setExpandedCampusId(campusId);
    }
  };

  const totalCampuses = mockCampuses.length;

  return (
    <div className="campuses-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Campus Management</h1>
        <p className="page-subtitle">
          Manage university campuses, boundaries, and location data
        </p>
      </div>

      {/* Main Content Container */}
      <div className="campuses-container">
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
              {filteredCampuses.map((campus) => (
                <React.Fragment key={campus.id}>
                  <tr className="campus-row">
                    {/* Campus Column with Avatar and Dropdown */}
                    <td className="campus-cell">
                      <div className="campus-info">
                        <img
                          src={campus.imageUrl}
                          alt={campus.name}
                          className="campus-avatar"
                        />
                        <div className="campus-dropdown">
                          <button
                            className="dropdown-button"
                            onClick={() => handleToggleExpand(campus.id)}
                          >
                            <AssetIcon
                              name="arrow-down"
                              size={10}
                              className={`chevron-icon ${
                                expandedCampusId === campus.id ? "expanded" : ""
                              }`}
                            />
                            <span className="campus-name">{campus.name}</span>
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* ID Column */}
                    <td className="campus-id-cell">
                      <div className="campus-id-wrapper">
                        <span className="campus-id">{campus.campusId}</span>
                        <button
                          className="copy-button"
                          onClick={() => handleCopyCampusId(campus.campusId)}
                          title="Copy ID"
                        >
                          <AssetIcon name="copy-icon" size={16} />
                        </button>
                      </div>
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
                      <button className="sync-button" title="Sync places">
                        <AssetIcon name="swap-arrows-icon" size={16} />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Boundary Row */}
                  {expandedCampusId === campus.id && (
                    <tr className="boundary-row">
                      <td colSpan={6} className="boundary-cell">
                        <div className="boundary-container">
                          <h3 className="boundary-title">Campus Boundary</h3>
                          <div className="boundary-map">
                            <CampusBoundary
                              readOnly={true}
                              initialBoundaryData={campus.boundaryData}
                              onBoundaryChange={() => {
                                // Read-only mode
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <p className="pagination-info">
            Showing {filteredCampuses.length} of {totalCampuses} entries
          </p>
          <div className="pagination-controls">
            <button className="pagination-button" disabled>
              Previous
            </button>
            <div className="page-number active">{currentPage}</div>
            <button className="pagination-button" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
