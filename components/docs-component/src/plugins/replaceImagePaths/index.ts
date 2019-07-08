import { Plugin, PluginType } from '@kyma-project/documentation-component';
import { replaceImagePaths } from './mutationPlugin';

const REPLACE_IMAGE_PATHS_MUTATION_PLUGIN = 'replace-image-paths-mutation';
const replaceImagePathsMutationPlugin: Plugin = {
  name: REPLACE_IMAGE_PATHS_MUTATION_PLUGIN,
  type: PluginType.MUTATION,
  sourceTypes: ['markdown', 'md'],
  fn: replaceImagePaths,
};

export { replaceImagePathsMutationPlugin, REPLACE_IMAGE_PATHS_MUTATION_PLUGIN };
