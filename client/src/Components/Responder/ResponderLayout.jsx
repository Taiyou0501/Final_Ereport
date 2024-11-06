import React from 'react';
import { Outlet } from 'react-router-dom';

const ResponderLayout = () => {
  return (
    <div>
      {/* Add any common layout elements for Responder here, like a sidebar or header */}
      <Outlet />
    </div>
  );
};

export default ResponderLayout;