import { Navigate, Outlet, useLocation, type RouteProps } from 'react-router-dom'

import { GetTokenInfo } from './tokenUtil'

type ProtectedRouteProps = RouteProps & { redirectTo?: string }

export const ProtectedRouteAuth = ({ redirectTo = '/login' }: ProtectedRouteProps) => {
  const { access_token } = GetTokenInfo()
  const location = useLocation()

  if (!access_token) {
    return (
      <Navigate
        to={{
          pathname: redirectTo,
          search: `?redirect=${location.pathname}${location.search}`,
        }}
        replace
      />
    )
  }

  return <Outlet />
}

type ProtectedRouteByRolProps = RouteProps & { redirectTo: string; roleAccess: string }

export const ProtectedRouteRol = ({ redirectTo, roleAccess }: ProtectedRouteByRolProps) => {
  const { role } = GetTokenInfo()

  if (role !== roleAccess) return <Navigate to={redirectTo} replace />

  return <Outlet />
}
