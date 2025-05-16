import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, } from "@coreui/react";
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
    const [flaggedUsers, setFlaggedUsers] = useState([]);
    const handleToggleFlagUser = (id) => {
        setFlaggedUsers((prev) => prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]);
    };
    return (_jsx("div", { style: {
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '0',
            overflow: 'hidden',
        }, children: _jsxs(CTable, { hover: true, responsive: true, className: "left-align", children: [_jsx(CTableHead, { children: _jsxs(CTableRow, { children: [_jsx(CTableHeaderCell, { scope: "col", children: "ID" }), _jsx(CTableHeaderCell, { scope: "col", children: "Name" }), _jsx(CTableHeaderCell, { scope: "col", children: "Email" }), _jsx(CTableHeaderCell, { scope: "col", children: "Joined" }), _jsx(CTableHeaderCell, { scope: "col", children: "Last Update" }), _jsx(CTableHeaderCell, { scope: "col" })] }) }), _jsx(CTableBody, { children: studentData.map((student) => (_jsxs(CTableRow, { color: flaggedUsers.includes(student.id) ? "danger" : undefined, children: [_jsx(CTableHeaderCell, { scope: "row", children: student.id }), _jsx(CTableDataCell, { children: student.name }), _jsx(CTableDataCell, { children: student.email }), _jsx(CTableDataCell, { children: student.joined }), _jsx(CTableDataCell, { children: student.lastUpdate }), _jsx(CTableDataCell, { children: _jsxs(CDropdown, { alignment: "end", children: [_jsx(CDropdownToggle, { color: "dark", variant: "ghost", caret: false, style: {
                                                backgroundColor: "transparent",
                                                border: "none",
                                                boxShadow: "none",
                                                padding: 0,
                                            }, children: "\u22EE " }), _jsxs(CDropdownMenu, { children: [_jsx(CDropdownItem, { children: "Send email" }), _jsx(CDropdownItem, { onClick: () => handleToggleFlagUser(student.id), children: flaggedUsers.includes(student.id) ? "Unflag user" : "Flag user" }), _jsx(CDropdownItem, { children: "Request edit" }), _jsx(CDropdownItem, { children: "Request to delete" })] })] }) })] }, student.id))) })] }) }));
};
export default StudentTable;
