import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CFormSelect,
  CAlert,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilReload } from "@coreui/icons";
import { useQuery } from "@tanstack/react-query";
import { campusService } from "../services/campusService";
import { placeService } from "../services/placeService";
import { queryKeys } from "../lib/queryClient";
import { PlacesFilters } from "../types/place";
import PlacesList from "../components/PlacesList";

const Places: React.FC = () => {
  const [filters, setFilters] = useState<PlacesFilters>({
    page: 1,
    limit: 20,
    is_deleted: false,
  });
  
  const [hierarchyView, setHierarchyView] = useState<'all' | 'top-level'>('top-level');
  
  const [selectedCampus, setSelectedCampus] = useState<string>("");
  const [alert, setAlert] = useState<{
    type: "success" | "danger" | "info";
    message: string;
  } | null>(null);

  // Fetch campuses for the dropdown
  const {
    data: campuses = [],
    isLoading: campusesLoading,
    error: campusesError,
  } = useQuery({
    queryKey: queryKeys.campuses,
    queryFn: campusService.getAll,
  });

  // Fetch places based on filters
  const {
    data: placesData,
    isLoading: placesLoading,
    error: placesError,
    refetch: refetchPlaces,
  } = useQuery({
    queryKey: ["places", filters, hierarchyView],
    queryFn: () => placeService.getAll({
      ...filters,
      // Show only top-level places if hierarchy view is selected
      hierarchy_level: hierarchyView === 'top-level' ? 0 : undefined,
    }),
    enabled: !!selectedCampus, // Only fetch when campus is selected
  });

  // Update filters when campus changes
  useEffect(() => {
    if (selectedCampus) {
      setFilters(prev => ({
        ...prev,
        campus_id: selectedCampus,
        page: 1, // Reset to first page
      }));
    }
  }, [selectedCampus]);

  // Removed unused handleSearch function

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  // Handle refresh
  const handleRefresh = () => {
    refetchPlaces();
    setAlert({
      type: "info",
      message: "Refreshing places...",
    });
    setTimeout(() => setAlert(null), 2000);
  };

  // Show alert for errors
  useEffect(() => {
    if (campusesError) {
      setAlert({
        type: "danger",
        message: "Failed to load campuses. Please try again.",
      });
    }
    if (placesError && selectedCampus) {
      setAlert({
        type: "danger",
        message: "Failed to load places. Please try again.",
      });
    }
  }, [campusesError, placesError, selectedCampus]);

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4" data-testid="places-page">
            <CCardHeader>
              <strong data-testid="places-page-title">Places Management</strong>
            </CCardHeader>
            <CCardBody>
              {alert && (
                <CAlert color={alert.type} dismissible onClose={() => setAlert(null)} data-testid="refresh-alert">
                  {alert.message}
                </CAlert>
              )}
              
              <CRow className="mb-4">
                <CCol md={4}>
                  <CFormSelect
                    value={selectedCampus}
                    onChange={(e) => setSelectedCampus(e.target.value)}
                    disabled={campusesLoading}
                    data-testid="campus-select"
                  >
                    <option value="" data-testid="campus-option-default">Select a campus...</option>
                    {campuses.map((campus) => (
                      <option key={campus.id} value={campus.id}>
                        {campus.campus_name} - {campus.city}, {campus.state}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                
                <CCol md={3}>
                  <CFormSelect
                    value={hierarchyView}
                    onChange={(e) => {
                      const value = e.target.value as 'all' | 'top-level';
                      setHierarchyView(value);
                      setFilters(prev => ({
                        ...prev,
                        page: 1, // Reset to first page
                      }));
                    }}
                    disabled={!selectedCampus}
                  >
                    <option value="top-level">Top Level Only</option>
                    <option value="all">All Places</option>
                  </CFormSelect>
                </CCol>
                
                {/* <CCol md={6}>
                  <CInputGroup>
                    <CFormInput
                      placeholder="Search places by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      disabled={!selectedCampus}
                    />
                    <CButton
                      color="primary"
                      onClick={handleSearch}
                      disabled={!selectedCampus}
                    >
                      <CIcon icon={cilSearch} />
                    </CButton>
                  </CInputGroup>
                </CCol> */}
                
                <CCol md={2}>
                  <CButton
                    color="secondary"
                    onClick={handleRefresh}
                    disabled={!selectedCampus || placesLoading}
                    className="w-100"
                    data-testid="refresh-button"
                  >
                    <CIcon icon={cilReload} className="me-2" />
                    Refresh
                  </CButton>
                </CCol>
              </CRow>

              {!selectedCampus && (
                <div className="text-center py-5 text-muted" data-testid="empty-prompt-select-campus">
                  <h5>Select a campus to view places</h5>
                  <p>Choose a campus from the dropdown above to see all places associated with it.</p>
                </div>
              )}

              {selectedCampus && placesLoading && (
                <div className="text-center py-5" data-testid="loading-places">
                  <CSpinner color="primary" />
                  <p className="mt-2">Loading places...</p>
                </div>
              )}

              {selectedCampus && !placesLoading && placesData && (
                <PlacesList
                  places={placesData.places}
                  total={placesData.total}
                  page={placesData.page}
                  pages={placesData.pages}
                  limit={placesData.limit}
                  onPageChange={handlePageChange}
                  onPlaceUpdate={() => refetchPlaces()}
                  onAlert={setAlert}
                />
              )}

              {selectedCampus && !placesLoading && placesData?.places.length === 0 && (
                <div className="text-center py-5 text-muted" data-testid="empty-prompt-no-places">
                  <h5>No places found</h5>
                  <p>There are no places associated with this campus.</p>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Places;