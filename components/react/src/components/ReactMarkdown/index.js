import React from 'react';
import ReactMarkdown from 'react-markdown';
import Code from './components/Code';
import { Markdown } from './styled';
import parseHtml from './parseHTML';
import { removeBlankLinesFromTabsBlock, processDoc } from './helpers';

export default ({ source, escapeHtml = false }) => {
  const sourceWithoutBlanks = removeBlankLinesFromTabsBlock(source);
  const processedSource = processDoc(sourceWithoutBlanks);
  return (
    <Markdown>
      <ReactMarkdown
        source={processedSource}
        escapeHtml={escapeHtml}
        renderers={{ code: Code }}
        astPlugins={[parseHtml]}
      />
    </Markdown>
  );
};
