import htmlParser from 'react-markdown/plugins/html-parser';

import { tabs } from './Tabs';

const isValidNode = node => node.type !== 'script';

export default htmlParser({
  isValidNode,
  processingInstructions: [tabs],
});
