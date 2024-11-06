import React from 'react';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div>
      {/* Add any common layout elements for User here, like a sidebar or header */}
      <Outlet />
    </div>
  );
};

export default UserLayout;