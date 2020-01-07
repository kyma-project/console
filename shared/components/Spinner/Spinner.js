import React from 'react';

export const Spinner = () => {
  return (
    <div className="fd-loading-dots" aria-hidden="false" aria-label="Loading">
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
