import React from 'react';
import styled from 'styled-components';

const StyledStrong = styled.strong`
  font-weight: 700;
`;

export const Strong = ({ children }) => <StyledStrong>{children}</StyledStrong>;
