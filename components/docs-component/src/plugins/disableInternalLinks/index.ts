import {
  Plugin,
  PluginType,
  MarkdownParserPlugin,
} from '@kyma-project/documentation-component';
import { disableInternalLinks } from './mutationPlugin';
import { disabledInternalLinkParser } from './parserPlugin';

const DISABLE_INTERNAL_LINKS_MUTATION_PLUGIN =
  'disable-internal-links-mutation';
const disableInternalLinksMutationPlugin: Plugin = {
  name: DISABLE_INTERNAL_LINKS_MUTATION_PLUGIN,
  type: PluginType.MUTATION,
  sourceTypes: ['markdown', 'md'],
  fn: disableInternalLinks,
};
const disableInternalLinksParserPlugin: MarkdownParserPlugin = disabledInternalLinkParser;

export {
  disableInternalLinksMutationPlugin,
  DISABLE_INTERNAL_LINKS_MUTATION_PLUGIN,
  disableInternalLinksParserPlugin,
};
