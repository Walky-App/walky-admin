import React, { useState } from 'react';

/**
 * This is a placeholder component to show how to create a form using CoreUI components.
 * 
 * In a real implementation, you would use CoreUI components like:
 * import { 
 *   CForm,
 *   CFormLabel,
 *   CFormInput,
 *   CFormSelect,
 *   CFormCheck,
 *   CButton,
 *   CCard,
 *   CCardBody
 * } from '@coreui/react';
 */
function BasicForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    active: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      // Handle checkbox (casting to handle checkbox)
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      // Handle other input types
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your API
    console.log('Form submitted:', formData);
    alert('Form submitted! Check console for details.');
  };

  return (
    <div className="card">
      <div className="card-header">
        User Form
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <div className="form-text">Enter user's full name</div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              className="form-select"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="guest">Guest</option>
            </select>
          </div>
          
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="active">Active</label>
          </div>
          
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
      
      <div className="card-footer text-muted">
        <small>In a real application, this form would use CoreUI components like CForm, CFormInput, etc.</small>
      </div>
    </div>
  );
}

export default BasicForm; 