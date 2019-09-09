import React from 'react';
import styled from 'styled-components';
import { Tooltip } from '@kyma-project/components';
import {
  MarkdownRenderEngineOptions,
  MarkdownParserPluginReturnType,
} from '@kyma-project/dc-markdown-render-engine';

import { RELATIVE_LINKS_DISABLED } from '../../../../constants';

const GreyedText = styled.div`
  display: inline;

  .disabled-internal-link {
    color: #959697;
    cursor: info;
    font-family: '72';
    font-size: 16px;
    line-height: 1.57;
  }

  .fd-inline-help {
    margin-left: 8px;
  }
`;

export const disabledInternalLinkParser = (
  args: MarkdownRenderEngineOptions,
): MarkdownParserPluginReturnType => ({
  replaceChildren: true,
  shouldProcessNode: (node: any) =>
    node.type === 'tag' &&
    node.name === 'div' &&
    node.attribs &&
    node.attribs.hasOwnProperty('disabled-internal-link'),
  processNode: (node: any) => {
    if (
      !node.children ||
      !node.children[0] ||
      node.children[0].type !== 'text'
    ) {
      return null;
    }

    return (
      <Tooltip content={RELATIVE_LINKS_DISABLED}>
        <GreyedText>
          <span className="disabled-internal-link">
            {node.children[0].data}
          </span>
        </GreyedText>
      </Tooltip>
    );
  },
});
