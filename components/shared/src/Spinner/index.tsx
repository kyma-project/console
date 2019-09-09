import React from 'react';
import { SpinnerWrapper } from './styled';

export const Spinner: React.FunctionComponent = () => (
  <SpinnerWrapper>
    <div className="fd-spinner" aria-hidden="false" aria-label="Loading">
      <div />
    </div>
  </SpinnerWrapper>
);
