import React from 'react';

const Spinner = () => {
  return (
    <div className="fd-loading-dots" aria-hidden="false" aria-label="Loading">
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Spinner;
