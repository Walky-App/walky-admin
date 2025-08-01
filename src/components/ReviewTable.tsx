import { useState, useEffect } from "react";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import API from "../API/";
import "../App.css";

interface Student {
  id: string;
  name: string;
  reason: string;
  joined: string;
  reportedOn: string;
}

const ReviewTable = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get<{
          users: {
            _id: string;
            first_name: string;
            last_name: string;
            reason: string;
            createdAt: string;
            reportedOn: string;
          }[];
        }>(
          "/users/?fields=_id,first_name,last_name,reason,createdAt,reportedOn"
        );

        const transformed = res.data.users.map((user) => ({
          id: user._id,
          name: `${user.first_name} ${user.last_name}`,
          reason: user.reason,
          joined: user.createdAt,
          reportedOn: user.reportedOn,
        }));

        setStudents(transformed);
      } catch (err) {
        console.error("❌ Failed to fetch student data:", err);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div
      style={{
        border: "1px solid #dee2e6",
        borderRadius: "8px",
        padding: "0",
        overflow: "hidden",
      }}
    >
      <CTable hover responsive className="custom-table-hover left-align">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Reason</CTableHeaderCell>
            <CTableHeaderCell scope="col">Joined</CTableHeaderCell>
            <CTableHeaderCell scope="col">Reported On</CTableHeaderCell>
            <CTableHeaderCell scope="col"></CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {students.map((student) => (
            <CTableRow key={student.id} data-testid="review-row">
              <CTableHeaderCell scope="row" data-testid="review-id">{student.id}</CTableHeaderCell>
              <CTableDataCell data-testid="review-name">{student.name}</CTableDataCell>
              <CTableDataCell data-testid="review-reason">{student.reason || '-'}</CTableDataCell>
              <CTableDataCell data-testid="review-joined">
                {new Date(student.joined).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </CTableDataCell>
              <CTableDataCell data-testid="review-reported">
                {new Date(student.reportedOn).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </CTableDataCell>
              <CTableDataCell>
                <CDropdown alignment="end">
                  <CDropdownToggle data-testid={`dropdown-toggle-${student.id}`}
                    color="dark"
                    variant="ghost"
                    caret={false}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      boxShadow: "none",
                      padding: 0,
                    }}
                  >
                    ⋮
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem data-testid={`send-email-${student.id}`} >Send Email</CDropdownItem>
                    <CDropdownItem data-testid={`view-logs-${student.id}`}>View activity logs</CDropdownItem>
                    <CDropdownItem data-testid={`suspend-${student.id}`}>Suspend user </CDropdownItem>
                    <CDropdownItem data-testid={`delete-${student.id}`}>Request to delete </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default ReviewTable;
