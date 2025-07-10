import React from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CPagination,
  CPaginationItem,
} from "@coreui/react";
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

const PlacesList: React.FC<PlacesListProps> = ({
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
        <CPaginationItem
          key="first"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
        >
          First
        </CPaginationItem>
      );
    }

    for (let i = start; i <= end; i++) {
      items.push(
        <CPaginationItem
          key={i}
          active={i === page}
          onClick={() => onPageChange(i)}
        >
          {i}
        </CPaginationItem>
      );
    }

    if (end < pages) {
      items.push(
        <CPaginationItem
          key="last"
          onClick={() => onPageChange(pages)}
          disabled={page === pages}
        >
          Last
        </CPaginationItem>
      );
    }

    return items;
  };

  return (
    <>
      <CTable hover responsive style={{ backgroundColor: "white" }}>
        <CTableHead style={{ backgroundColor: "#343a40" }}>
          <CTableRow>
            <CTableHeaderCell className="text-white fw-bold">Name</CTableHeaderCell>
            <CTableHeaderCell className="text-white fw-bold">Address</CTableHeaderCell>
            <CTableHeaderCell className="text-white fw-bold">Category</CTableHeaderCell>
            <CTableHeaderCell className="text-white fw-bold">Rating</CTableHeaderCell>
            <CTableHeaderCell className="text-white fw-bold">Photos</CTableHeaderCell>
            <CTableHeaderCell className="text-white fw-bold">Status</CTableHeaderCell>
            {/* <CTableHeaderCell>Actions</CTableHeaderCell> */}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {places.map((place) => (
            <ExpandablePlaceRow
              key={place._id}
              place={place}
              onAlert={onAlert}
            />
          ))}
        </CTableBody>
      </CTable>

      {pages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} places
          </div>
          <CPagination>{renderPagination()}</CPagination>
        </div>
      )}
    </>
  );
};

export default PlacesList;
