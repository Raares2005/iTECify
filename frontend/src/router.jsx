import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CodeScreen from './screens/CodeScreen';

function AppLayout() {
  return (
    <>
      <Outlet />
      <ToastContainer />
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout />}>
      <Route index element={<Navigate to="/login" replace />} />

      <Route element={<PublicRoute />}>
        <Route path="login" element={<LoginScreen />} />
        <Route path="register" element={<RegisterScreen />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="code" element={<CodeScreen />} />
      </Route>
    </Route>
  )
);

export default router;