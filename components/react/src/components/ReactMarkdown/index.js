import React from 'react';
import ReactMarkdown from 'react-markdown';
import Code from './components/Code';
import { Markdown } from './styled';

export default ({ source }) => {
  return (
    <Markdown>
      <ReactMarkdown source={source} renderers={{ code: Code }} />
    </Markdown>
  );
};
