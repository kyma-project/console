import { Plugin, PluginType } from '@kyma-project/documentation-component';
import { MarkdownParserPlugin } from '@kyma-project/dc-markdown-render-engine';
import { disableInternalLinks } from './mutationPlugin';
import { disabledInternalLinkParser } from './parserPlugin';

const disableInternalLinksMutationPlugin: Plugin = {
  name: 'disable-internal-links-mutation',
  type: PluginType.MUTATION,
  sourceTypes: ['markdown', 'md'],
  fn: disableInternalLinks,
};
const disableInternalLinksParserPlugin: MarkdownParserPlugin = disabledInternalLinkParser;

export { disableInternalLinksMutationPlugin, disableInternalLinksParserPlugin };
