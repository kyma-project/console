import { MutationPluginArgs } from '@kyma-project/documentation-component';

const HREF_WITH_ID_REGEXP = /\<a id=\"(.*?)\" \/\>/g;

export function removeHref({ source, options }: MutationPluginArgs): string {
  const content = source.content || source.rawContent;
  return content.replace(HREF_WITH_ID_REGEXP, '');
}
