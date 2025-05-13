import { useState } from "react";
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

const studentData = [
  {
    id: "67236617",
    name: "Gal Gordon",
    email: "gal@walkyu.edu",
    joined: "Oct 31, 2024",
    lastUpdate: "May 10, 2025",
  },
  {
    id: "67236618",
    name: "Danielle Newman",
    email: "danielle@walkyu.edu",
    joined: "Nov 1, 2024",
    lastUpdate: "May 10, 2025",
  },
  {
    id: "67236619",
    name: "Jeremiah Newman",
    email: "jeremiah@walkyu.edu",
    joined: "Nov 4, 2024",
    lastUpdate: "May 9, 2025",
  },
  {
    id: "67236620",
    name: "Glenda Oliveira",
    email: "glenda@walkyu.edu",
    joined: "Nov 3, 2024",
    lastUpdate: "May 9, 2025",
  },
  {
    id: "67236621",
    name: "Thauane Mayrink",
    email: "thauane@walkyu.edu",
    joined: "Dec 12, 2024",
    lastUpdate: "May 9, 2025",
  },
  {
    id: "67236622",
    name: "Oleksii Vasylenko",
    email: "oleksii@walkyu.edu",
    joined: "Dec 31, 2024",
    lastUpdate: "May 9, 2025",
  },
  {
    id: "67236623",
    name: "Joanna Pak",
    email: "joanna@walkyu.edu",
    joined: "Jan 15, 2025",
    lastUpdate: "May 9, 2025",
  },
];

const StudentTable = () => {
        const [flaggedUsers, setFlaggedUsers] = useState<string[]>([]);
      
        const handleToggleFlagUser = (id: string) => {
          setFlaggedUsers((prev) =>
            prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
          );
        };
  return (
    <div
  style={{
    border: '1px solid #dee2e6', 
    borderRadius: '8px',  
    padding: '0',  
    overflow: 'hidden', 
  }}
>
    <CTable hover responsive className="left-align">
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">ID</CTableHeaderCell>
          <CTableHeaderCell scope="col">Name</CTableHeaderCell>
          <CTableHeaderCell scope="col">Email</CTableHeaderCell>
          <CTableHeaderCell scope="col">Joined</CTableHeaderCell>
          <CTableHeaderCell scope="col">Last Update</CTableHeaderCell>
          <CTableHeaderCell scope="col"></CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {studentData.map((student) => (
          <CTableRow key={student.id}
          color={flaggedUsers.includes(student.id) ? "danger" : undefined}>
            <CTableHeaderCell scope="row">{student.id}</CTableHeaderCell>
            <CTableDataCell>{student.name}</CTableDataCell>
            <CTableDataCell>{student.email}</CTableDataCell>
            <CTableDataCell>{student.joined}</CTableDataCell>
            <CTableDataCell>{student.lastUpdate}</CTableDataCell>
            <CTableDataCell>
              <CDropdown alignment="end">
                <CDropdownToggle
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
                  ⋮ {/* Unicode for vertical three dots */}
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Send email</CDropdownItem>
                  <CDropdownItem onClick={() => handleToggleFlagUser(student.id)}>
                    {flaggedUsers.includes(student.id) ? "Unflag user" : "Flag user"}</CDropdownItem>
                  <CDropdownItem>Request edit</CDropdownItem>
                  <CDropdownItem>Request to delete</CDropdownItem>
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

export default StudentTable;
