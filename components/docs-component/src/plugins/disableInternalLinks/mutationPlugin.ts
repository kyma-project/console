import {
  Source,
  MutationPluginReturnType,
  MutationPluginArgs,
} from '@kyma-project/documentation-component';

const LINKS_MD_REGEX = /\[([^\[]+)\]\(([^\)]+)\)/g;

function fn(str: string): string {
  return str.replace(LINKS_MD_REGEX, (substring: string) => {
    LINKS_MD_REGEX.lastIndex = 0;
    const matched = LINKS_MD_REGEX.exec(substring);
    if (matched && matched[2] && !matched[2].startsWith('http')) {
      return `<div disabled-internal-link>${matched[1]}</div>`;
    }
    return substring;
  });
}

export const disableInternalLinks = ({
  source,
}: MutationPluginArgs): MutationPluginReturnType =>
  source.content ? fn(source.content) : fn(source.rawContent);
