import React from 'react';
import Success from './Success';

const ParentComponent = () => {
  const imageId = 1; // Replace with the actual image ID

  return (
    <div>
      <h1>Success Page</h1>
      <Success imageId={imageId} />
    </div>
  );
};

export default ParentComponent;