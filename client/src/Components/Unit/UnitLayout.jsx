import React from 'react';
import { Outlet } from 'react-router-dom';

const UnitLayout = () => {
  return (
    <div>
      {/* Add any common layout elements for Unit here, like a sidebar or header */}
      <Outlet />
    </div>
  );
};

export default UnitLayout;