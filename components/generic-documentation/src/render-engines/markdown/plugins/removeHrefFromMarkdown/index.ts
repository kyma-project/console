import { Plugin, PluginType } from '@kyma-project/documentation-component';
import { removeHref } from './mutationPlugin';

const removeHrefFromMarkdown: Plugin = {
  name: 'remove-href-from-markdown-mutation',
  type: PluginType.MUTATION,
  sourceTypes: ['markdown', 'md'],
  fn: removeHref,
};

export { removeHrefFromMarkdown };
