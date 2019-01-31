import React from 'react';
import styled from 'styled-components';

const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 75px;
  height: 75px;
`;

const Spinner = () => (
  <SpinnerWrapper>
    <div className="fd-spinner" aria-hidden="false" aria-label="Loading">
      <div />
    </div>
  </SpinnerWrapper>
);

export default Spinner;
