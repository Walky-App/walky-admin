import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme'; // ✅ Update path if needed

export function BreadcrumbDividersExample() {
  const location = useLocation();
  const { theme } = useTheme(); // ✅ Get access to theme
  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
    <CBreadcrumb
  className="mb-3"
  style={{
    '--cui-breadcrumb-divider': `'/'`,
    '--breadcrumb-divider-color': theme.colors.bodyColor,
    
  } as React.CSSProperties}
>
      <CBreadcrumbItem>
        <Link to="/" style={{ color: theme.colors.primary, textDecoration: 'none' }}>
          Home
        </Link>
      </CBreadcrumbItem>

      {location.pathname === '/' ? (
        <CBreadcrumbItem active style={{ color: theme.colors.bodyColor }}>
          Dashboard
        </CBreadcrumbItem>
      ) : (
        pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label = decodeURIComponent(value);

          return (
            <CBreadcrumbItem
              key={to}
              active={index === pathnames.length - 1}
              style={{ color: theme.colors.bodyColor }}
            >
              {index === pathnames.length - 1 ? (
                label.charAt(0).toUpperCase() + label.slice(1)
              ) : (
                <Link to={to} style={{ color: theme.colors.bodyColor, textDecoration: 'none' }}>
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </Link>
              )}
            </CBreadcrumbItem>
          );
        })
      )}
    </CBreadcrumb>
  );
}
