import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import CodeEditor from './components/CodeEditor.jsx'
import store from './store';
import App from './App.js'
import PrivateRoute from './components/PrivateRoute.jsx';
import signIn from './components/signIn.jsx';
import signUp from './components/signUp.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<signIn />} />
      <Route path="signIn" element={<signIn />} />
      <Route path="signUp" element={<signUp />} />
      <Route path="code" element={<CodeEditor/>} />
      <Route element={<PrivateRoute />}>
        {/* <Route path="profile" element={<ProfileScreen />} /> */}
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);