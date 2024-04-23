import { Navigate, Outlet, RouteProps } from 'react-router-dom'
import { GetTokenInfo } from './tokenUtil'

type ProtectedRouteProps = RouteProps & { redirectTo?: string }

export function ProtectedRouteAuth({ redirectTo = '/login' }: ProtectedRouteProps) {
  const { access_token } = GetTokenInfo()

  if (!access_token) return <Navigate to={redirectTo} replace />

  return <Outlet />
}

type ProtectedRouteByRolProps = RouteProps & { redirectTo: string; roleAccess: string }

export function ProtectedRouteRol({ redirectTo, roleAccess }: ProtectedRouteByRolProps) {
  const { role } = GetTokenInfo()

  if (role !== roleAccess) return <Navigate to={redirectTo} replace />

  return <Outlet />
}
