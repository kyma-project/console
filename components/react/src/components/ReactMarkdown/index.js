import React from 'react';
import RM from 'react-markdown';
import BlockQuote from './components/Blockquote';
import Code from './components/Code/';
import { Markdown } from './styled';
import parseHtml from './parseHTML';
import {
  removeBlankLinesFromTabsBlock,
  putNewlineSpaceBeforeList,
} from './helpers';

const ReactMarkdown = ({ source, escapeHtml = false }) => {
  if (!source) {
    return null;
  }
  const processedSource = putNewlineSpaceBeforeList(
    removeBlankLinesFromTabsBlock(source),
  );

  return (
    <Markdown>
      <RM
        source={processedSource}
        escapeHtml={escapeHtml}
        renderers={{ code: Code, blockquote: BlockQuote }}
        astPlugins={[parseHtml]}
      />
    </Markdown>
  );
};

export default ReactMarkdown;
