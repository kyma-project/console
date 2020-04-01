import React from 'react';

export const Spinner = ({ ariaLabel = 'Loading' }) => {
  return (
    <div className="fd-loading-dots" aria-hidden="false" aria-label={ariaLabel}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
