import React from 'react';
import {
  MarkdownRenderEngineOptions,
  MarkdownParserPluginReturnType,
} from '@kyma-project/documentation-component';
import { Tooltip } from '@kyma-project/react-components';
import styled from 'styled-components';

const GreyedText = styled.span`
  color: #959697;
  cursor: pointer;
  font-family: '72';
  font-size: 16px;
  line-height: 1.57;
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
    const content = 'Placeholder';

    return (
      <Tooltip content={content} orientation={'top'}>
        <GreyedText>{node.children[0].data}</GreyedText>
      </Tooltip>
    );
  },
});
