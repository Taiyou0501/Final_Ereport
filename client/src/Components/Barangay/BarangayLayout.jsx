import React from 'react';
import { Outlet } from 'react-router-dom';

const BarangayLayout = () => {
  return (
    <div>
      {/* Add any common layout elements for Barangay here, like a sidebar or header */}
      <Outlet />
    </div>
  );
};

export default BarangayLayout;