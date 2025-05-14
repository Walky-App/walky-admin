import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';

import { useLocation, Link } from 'react-router-dom';

export function BreadcrumbDividersExample() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
   
    <CBreadcrumb
    className="mb-3"
      style={{ '--cui-breadcrumb-divider': `'>'` } as React.CSSProperties}
      >
      <CBreadcrumbItem>
        <Link to="/">Home</Link>
      </CBreadcrumbItem>

      {/* If on root path, show Dashboard */}
      {location.pathname === '/' ? (
        <CBreadcrumbItem active>Dashboard</CBreadcrumbItem>
      ) : (
        pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label = decodeURIComponent(value);

          return (
            <CBreadcrumbItem key={to} active={index === pathnames.length - 1}>
              {index === pathnames.length - 1 ? (
                label.charAt(0).toUpperCase() + label.slice(1)
              ) : (
                <Link to={to}>{label.charAt(0).toUpperCase() + label.slice(1)}</Link>
              )}
            </CBreadcrumbItem>
          );
        })
      )}
    </CBreadcrumb>
   
  );
}

export default CBreadcrumb