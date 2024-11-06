import React from 'react';
import { Outlet } from 'react-router-dom';

const PoliceLayout = () => {
  return (
    <div>
      {/* Add any common layout elements for Police here, like a sidebar or header */}
      <Outlet />
    </div>
  );
};

export default PoliceLayout;