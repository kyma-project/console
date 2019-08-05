import React from 'react';
import styled from 'styled-components';

const StyledLink = styled.a``;

export const Link: React.FunctionComponent<any> = ({
  target,
  rel,
  ...rest
}) => <StyledLink target="_blank" rel="noopener noreferrer" {...rest} />;
