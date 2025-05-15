import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
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
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            // Handle checkbox (casting to handle checkbox)
            setFormData({
                ...formData,
                [name]: e.target.checked
            });
        }
        else {
            // Handle other input types
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would send this data to your API
        console.log('Form submitted:', formData);
        alert('Form submitted! Check console for details.');
    };
    return (_jsxs("div", { className: "card", children: [_jsx("div", { className: "card-header", children: "User Form" }), _jsx("div", { className: "card-body", children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "name", className: "form-label", children: "Name" }), _jsx("input", { type: "text", className: "form-control", id: "name", name: "name", value: formData.name, onChange: handleChange, required: true }), _jsx("div", { className: "form-text", children: "Enter user's full name" })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "email", className: "form-label", children: "Email" }), _jsx("input", { type: "email", className: "form-control", id: "email", name: "email", value: formData.email, onChange: handleChange, required: true })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "role", className: "form-label", children: "Role" }), _jsxs("select", { className: "form-select", id: "role", name: "role", value: formData.role, onChange: handleChange, children: [_jsx("option", { value: "admin", children: "Admin" }), _jsx("option", { value: "user", children: "User" }), _jsx("option", { value: "guest", children: "Guest" })] })] }), _jsxs("div", { className: "mb-3 form-check", children: [_jsx("input", { type: "checkbox", className: "form-check-input", id: "active", name: "active", checked: formData.active, onChange: handleChange }), _jsx("label", { className: "form-check-label", htmlFor: "active", children: "Active" })] }), _jsx("button", { type: "submit", className: "btn btn-primary", children: "Submit" })] }) }), _jsx("div", { className: "card-footer text-muted", children: _jsx("small", { children: "In a real application, this form would use CoreUI components like CForm, CFormInput, etc." }) })] }));
}
export default BasicForm;
