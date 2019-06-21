import React from 'react';
import RM from 'react-markdown';
import BlockQuote from './components/Blockquote';
import { Strong } from './components/Strong';
import { Link } from './components/Link';
import Code from './components/Code/';
import { Markdown } from './styled';
import parseHtml from './parseHTML';
import {
  removeBlankLinesFromTabsBlock,
  putNewlineSpaceBeforeList,
} from './helpers';

const ReactMarkdown = ({ source, escapeHtml = true }) => {
  if (!source) {
    return null;
  }
  const processedSource = removeBlankLinesFromTabsBlock(
    putNewlineSpaceBeforeList(source),
  );

  return (
    <Markdown>
      <RM
        source={processedSource}
        // escapeHtml={true}
        skipHtml={true}
        renderers={{
          code: Code,
          blockquote: BlockQuote,
          strong: Strong,
          link: Link,
        }}
        astPlugins={[parseHtml]}
      />
    </Markdown>
  );
};

export default ReactMarkdown;
