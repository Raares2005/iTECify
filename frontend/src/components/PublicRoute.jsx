import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PublicRoute() {
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo ? <Navigate to="/code" replace /> : <Outlet />;
}

export default PublicRoute;