import React from 'react';
import styled from 'styled-components';

const StyledLink = styled.a``;

export const MarkdownLink = (props: any) => {
  const { target, rel, ...rest } = props;
  return <StyledLink target="_blank" rel="noopener noreferrer" {...rest} />;
};
