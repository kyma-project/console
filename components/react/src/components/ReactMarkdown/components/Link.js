import React from 'react';
import styled from 'styled-components';

const StyledLink = styled.a``;

export const Link = props => {
  const { target, ...rest } = props;
  return <StyledLink target="_blank" {...rest} />;
};
