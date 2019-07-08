import React from 'react';
import {
  DC,
  Content,
  markdownTabsMutationPlugin,
  markdownTabsParserPlugin,
  markdownRenderEngine,
  markdownHeadersPlugin,
  RenderedContent,
  frontmatterMutationPlugin,
  replaceAllLessThanCharsMutationPlugin,
  Tabs,
  Tab,
  MARKDOWN_HEADER_EXTRACTOR_PLUGIN,
  Sources,
  Source,
} from '@kyma-project/documentation-component';
import { StickyContainer, Sticky } from 'react-sticky';
import {
  asyncApiRenderEngine,
  asyncApiOptions,
  MarkdownLink,
  highlightTheme,
  CopyButton,
  HeadersNavigation,
} from './render-engines';
import { replaceImagePathsMutationPlugin } from './plugins';
import { headingPrefix, customNodes } from './helpers';
import { MarkdownSingleRenderer } from './renderers';
import { ContentWrapper } from './styled';

export interface DocsComponentProps {
  sources: Source[];
  navigation?: boolean;
}

export const DocsComponent: React.FunctionComponent<DocsComponentProps> = ({
  sources,
  navigation = false,
}) => {
  if (!sources) {
    return null;
  }

  return (
    <DC.Provider
      sources={[
        {
          sources,
          pluginsOptions: [
            {
              name: MARKDOWN_HEADER_EXTRACTOR_PLUGIN,
              options: {
                headerPrefix: headingPrefix,
                customNodes,
              },
            },
          ],
        },
      ]}
      plugins={[
        frontmatterMutationPlugin,
        replaceImagePathsMutationPlugin,
        replaceAllLessThanCharsMutationPlugin,
        markdownTabsMutationPlugin,
        markdownHeadersPlugin,
      ]}
      renderEngines={[
        {
          renderEngine: markdownRenderEngine,
          options: {
            customRenderers: {
              link: MarkdownLink,
            },
            parsers: [markdownTabsParserPlugin],
            headingPrefix,
            highlightTheme,
            copyButton: CopyButton,
          },
        },
        {
          renderEngine: asyncApiRenderEngine,
          options: {
            ...asyncApiOptions,
          },
        },
      ]}
    >
      <ContentWrapper>
        <StickyContainer>
          <div>
            <Content
              renderers={{
                single: [MarkdownSingleRenderer],
              }}
            />
          </div>
          <Sticky>
            {({ style }: any) => (
              <div style={{ ...style, zIndex: 200, width: '310px' }}>
                <HeadersNavigation />
              </div>
            )}
          </Sticky>
        </StickyContainer>
      </ContentWrapper>
    </DC.Provider>
  );
};
