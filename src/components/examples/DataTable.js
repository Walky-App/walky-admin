import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
function DataTable() {
    // Sample data - in a real app, this would come from an API
    const [users] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'active' },
        { id: 5, name: 'Sam Wilson', email: 'sam@example.com', role: 'Guest', status: 'inactive' },
    ]);
    // Example action handler
    const handleAction = (id, action) => {
        console.log(`${action} user with ID: ${id}`);
        alert(`${action} clicked for user ${id}. Check console for details.`);
    };
    return (_jsxs("div", { className: "card", children: [_jsx("div", { className: "card-header", children: _jsx("strong", { children: "Users Table" }) }), _jsx("div", { className: "card-body", children: _jsxs("table", { className: "table table-striped table-hover", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { scope: "col", children: "ID" }), _jsx("th", { scope: "col", children: "Name" }), _jsx("th", { scope: "col", children: "Email" }), _jsx("th", { scope: "col", children: "Role" }), _jsx("th", { scope: "col", children: "Status" }), _jsx("th", { scope: "col", children: "Actions" })] }) }), _jsx("tbody", { children: users.map((user) => (_jsxs("tr", { children: [_jsx("td", { children: user.id }), _jsx("td", { children: user.name }), _jsx("td", { children: user.email }), _jsx("td", { children: user.role }), _jsx("td", { children: _jsx("span", { className: `badge bg-${user.status === 'active' ? 'success' : 'danger'}`, children: user.status }) }), _jsxs("td", { children: [_jsx("button", { className: "btn btn-sm btn-info me-2", onClick: () => handleAction(user.id, 'View'), children: "View" }), _jsx("button", { className: "btn btn-sm btn-warning me-2", onClick: () => handleAction(user.id, 'Edit'), children: "Edit" }), _jsx("button", { className: "btn btn-sm btn-danger", onClick: () => handleAction(user.id, 'Delete'), children: "Delete" })] })] }, user.id))) })] }) }), _jsx("div", { className: "card-footer text-muted", children: _jsx("small", { children: "In a real application, this table would use CoreUI components like CTable, CTableHead, etc." }) })] }));
}
export default DataTable;
