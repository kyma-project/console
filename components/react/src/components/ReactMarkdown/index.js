import React from 'react';
import ReactMarkdown from 'react-markdown';
import BlockQuote from './components/Blockquote';
import Code from './components/Code/';
import { Markdown } from './styled';
import parseHtml from './parseHTML';
import { removeBlankLinesFromTabsBlock } from './helpers';

export default ({ source, escapeHtml = false }) => {
  const processedSource = removeBlankLinesFromTabsBlock(source);
  return (
    <Markdown>
      <ReactMarkdown
        source={processedSource}
        escapeHtml={escapeHtml}
        renderers={{ code: Code, blockquote: BlockQuote }}
        astPlugins={[parseHtml]}
      />
    </Markdown>
  );
};
