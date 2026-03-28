import React from 'react';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      <h1>Layout</h1>
      <Outlet />
    </div>
  );
}

export default App;