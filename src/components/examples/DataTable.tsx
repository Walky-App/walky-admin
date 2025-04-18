import { useState } from 'react';

/**
 * This is a placeholder component to show how to create a data table using CoreUI.
 * 
 * In a real implementation, you would use CoreUI components like:
 * import { 
 *   CTable,
 *   CTableHead,
 *   CTableRow,
 *   CTableHeaderCell,
 *   CTableBody,
 *   CTableDataCell,
 *   CBadge,
 *   CButton
 * } from '@coreui/react';
 */

// Example user data type
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
};

function DataTable() {
  // Sample data - in a real app, this would come from an API
  const [users] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'active' },
    { id: 5, name: 'Sam Wilson', email: 'sam@example.com', role: 'Guest', status: 'inactive' },
  ]);

  // Example action handler
  const handleAction = (id: number, action: string) => {
    console.log(`${action} user with ID: ${id}`);
    alert(`${action} clicked for user ${id}. Check console for details.`);
  };

  return (
    <div className="card">
      <div className="card-header">
        <strong>Users Table</strong>
      </div>
      <div className="card-body">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`badge bg-${user.status === 'active' ? 'success' : 'danger'}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-info me-2"
                    onClick={() => handleAction(user.id, 'View')}
                  >
                    View
                  </button>
                  <button 
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleAction(user.id, 'Edit')}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleAction(user.id, 'Delete')}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-footer text-muted">
        <small>In a real application, this table would use CoreUI components like CTable, CTableHead, etc.</small>
      </div>
    </div>
  );
}

export default DataTable; 