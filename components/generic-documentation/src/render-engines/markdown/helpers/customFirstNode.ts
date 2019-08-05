import { Source } from '@kyma-project/documentation-component';
import { plugins } from '@kyma-project/dc-markdown-render-engine';
import { headingPrefix } from './headingPrefix';

type Header = plugins.Header;

export function customFirstNode(
  source: Source,
  toKebabCase: (str: string) => string,
): Header | undefined {
  const title: string =
    source.data && source.data.frontmatter && source.data.frontmatter.title;

  if (!title) {
    return;
  }

  return {
    title,
    id: toKebabCase(headingPrefix(source)),
    level: 'doc-title',
    source,
  };
}
