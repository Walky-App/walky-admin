import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';
import { useLocation, Link } from 'react-router-dom';
export function BreadcrumbDividersExample() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(Boolean);
    return (_jsxs(CBreadcrumb, { className: "mb-3", style: { '--cui-breadcrumb-divider': `'>'` }, children: [_jsx(CBreadcrumbItem, { children: _jsx(Link, { to: "/", children: "Home" }) }), location.pathname === '/' ? (_jsx(CBreadcrumbItem, { active: true, children: "Dashboard" })) : (pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const label = decodeURIComponent(value);
                return (_jsx(CBreadcrumbItem, { active: index === pathnames.length - 1, children: index === pathnames.length - 1 ? (label.charAt(0).toUpperCase() + label.slice(1)) : (_jsx(Link, { to: to, children: label.charAt(0).toUpperCase() + label.slice(1) })) }, to));
            }))] }));
}
export default CBreadcrumb;
