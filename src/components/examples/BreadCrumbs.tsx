import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { useLocation, Link } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'

export function BreadcrumbDividersExample() {
  const location = useLocation()
  const { theme } = useTheme()
  const pathnames = location.pathname.split('/').filter(Boolean)

  return (
    <CBreadcrumb
      className="mb-2"
      style={{
        '--cui-breadcrumb-divider': `'/'`,
        
        color: theme.colors.text,
      } as React.CSSProperties}
    >
      {/* Home link */}
      <CBreadcrumbItem>
        <Link
          to="/"
          style={{
            color: theme.colors.primary,
            textDecoration: 'none',
          }}
        >
          Home
        </Link>
      </CBreadcrumbItem>

      {/* If you're on root, show just "Dashboard" */}
      {location.pathname === '/' ? (
        <CBreadcrumbItem active>
          <span style={{ color: theme.colors.text }}>Dashboard</span>
        </CBreadcrumbItem>
      ) : (
        pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`
          const label = decodeURIComponent(value)

          return (
            <CBreadcrumbItem key={to} active={index === pathnames.length - 1}>
              {index === pathnames.length - 1 ? (
                <span style={{ color: theme.colors.text }}>
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </span>
              ) : (
                <Link
                  to={to}
                  style={{
                    color: theme.colors.text,
                    textDecoration: 'none',
                  }}
                >
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </Link>
              )}
            </CBreadcrumbItem>
          )
        })
      )}
    </CBreadcrumb>
  )
}


export default BreadcrumbDividersExample