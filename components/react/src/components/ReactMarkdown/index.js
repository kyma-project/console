import React from 'react';
import ReactMarkdown from 'react-markdown';
import Code from './components/Code';
import { Markdown } from './styled';
import parseHtml from './parseHTML';
import { removeBlankLinesFromTabsBlock, processDoc } from './helpers';

export default ({ source, escapeHtml = false }) => {
  const processedSource = processDoc(source);
  const sourceWithoutBlanks = removeBlankLinesFromTabsBlock(
    processedSource.source,
  );
  return (
    <Markdown>
      <ReactMarkdown
        source={sourceWithoutBlanks}
        escapeHtml={escapeHtml}
        renderers={{ code: Code }}
        astPlugins={[parseHtml]}
      />
    </Markdown>
  );
};
