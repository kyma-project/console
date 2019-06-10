import React from 'react';
import HtmlToReact from 'html-to-react';
import htmlParser from 'react-markdown/plugins/html-parser';

import { tabs } from './Tabs';
import { link } from './Link';
import { img } from './Image';

const isValidNode = node => node.type !== 'script';
const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);

export default htmlParser({
  isValidNode,
  processingInstructions: [
    tabs,
    link,
    img,
    {
      // Anything else
      shouldProcessNode: node => true,
      processNode: processNodeDefinitions.processDefaultNode,
    },
  ],
});
