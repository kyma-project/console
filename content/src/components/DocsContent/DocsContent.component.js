import React from 'react';
import Highlight from 'react-highlight/lib/optimized.js';
import { Markdown, Toolbar } from '@kyma-project/react-components';

import {
  DocsWrapper,
  Wrapper,
  ContentHeader,
  ContentDescription,
  Anchor,
  TextWrapper,
} from './styled';

import { tokenize } from '../../commons/helpers';

const DocsContent = ({ content, docsTypesLength }) => {
  const { docs = [] } = content;
  let lastType = '';

  return (
    <>
      {content && (
        <DocsWrapper>
          <Toolbar title={content.displayName} customPadding={'28px 0'} />

          {docs &&
            docs.map((doc, index) => {
              const type = doc.type || doc.title;
              const tokenizedType = tokenize(type);
              const hash = `${tokenizedType}-${tokenize(doc.title)}`;
              const typeHash = `${tokenizedType}-${tokenizedType}`;

              const isFirstOfType = type !== lastType;
              lastType = type;

              const typeLength = docsTypesLength[type];

              return (
                <Wrapper key={index}>
                  {isFirstOfType && typeLength && (
                    <Anchor
                      id={typeHash}
                      data-scrollspy-node-type="groupOfDocuments"
                    />
                  )}
                  <ContentHeader
                    id={hash}
                    data-scrollspy-node-type={
                      typeLength ? 'document' : 'groupOfDocuments'
                    }
                  >
                    {doc.title}
                  </ContentHeader>
                  <ContentDescription>
                    <TextWrapper>
                      <Markdown>
                        <Highlight
                          languages={['javascript', 'go']}
                          innerHTML={true}
                        >
                          {doc.source}
                        </Highlight>
                      </Markdown>
                    </TextWrapper>
                  </ContentDescription>
                </Wrapper>
              );
            })}
        </DocsWrapper>
      )}
    </>
  );
};

export default DocsContent;
