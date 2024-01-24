import { Navigate, Outlet, RouteProps } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type ProtectedRouteProps = RouteProps & {
    redirectTo?: string;
};

export function ProtectedRouteAuth({ redirectTo = '/login' }: ProtectedRouteProps) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to={redirectTo} replace />;
    }
    return <Outlet />;
}

type ProtectedRouteByRolProps = RouteProps & {
    redirectTo: string;
    canRolActived: string;
};


export function ProtectedRouteRol({ redirectTo, canRolActived }: ProtectedRouteByRolProps) {
    const { user } = useAuth();

    if (user.rol !== canRolActived) {
        return <Navigate to={redirectTo} replace />;
    }
    return <Outlet />;
}