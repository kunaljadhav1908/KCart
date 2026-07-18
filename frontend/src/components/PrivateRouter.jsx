import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => !!localStorage.getItem('access_Token');

export default function PrivateRoute({redirectTo="/login"}) {
  return isAuthenticated() ? <Outlet /> : <Navigate to={redirectTo} />;
}