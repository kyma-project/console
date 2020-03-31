import React from 'react';

export const Spinner = ({ testid = 'fd-spinner' }) => {
  return (
    <div
      className="fd-loading-dots"
      aria-hidden="false"
      aria-label="Loading"
      data-testid={testid}
    >
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
