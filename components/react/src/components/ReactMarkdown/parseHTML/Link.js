import React from 'react';
import styled from 'styled-components';

import ReactMarkdown from '../index';

const StyledLink = styled.a``;

export const link = {
  shouldProcessNode: node => node.type === 'tag' && node.name === 'a',
  processNode: node => {
    const data =
      node && node.children && node.children[0] && node.children[0].data;
    return (
      <a {...node.attribs} target="_blank" rel="noopener noreferrer">
        <ReactMarkdown source={data} />
      </a>
    );
  },
};
