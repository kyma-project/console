import React from 'react';
import Highlight from 'react-highlight/lib/optimized.js';
import { Markdown, Toolbar } from '@kyma-project/react-components';

import {
  Wrapper,
  ContentHeader,
  ContentDescription,
  Anchor,
  TextWrapper,
} from "./styled";

import { tokenize } from '../../commons/helpers';

const DocsContent = ({ content }) => {
  const { docs = [] } = content;

  const docsTypesLength = (() => {
    let docsTypesLength = {};
    docs.map(doc => {
      const type = doc.type || doc.title;
      if (!(type in docsTypesLength)) {
        docsTypesLength[type] = 0;
      }
      if (doc.title) docsTypesLength[type]++;

      return doc;
    });
    return docsTypesLength;
  })();
  let lastType = "";

  return (
    <div>
      {content && (
        <div>
          <Toolbar headline={content.displayName} customPadding={'28px 0'} />

          {content.docs &&
            content.docs.map((doc, index) => {
              // const type = doc.type ? doc.type : doc.title;
              // const hash = `${tokenize(type)}-${tokenize(doc.title)}`;
              // let isFirtsOfType = false;
              // const currentTypeHash = `${tokenize(type)}-${tokenize(type)}`;

              // isFirtsOfType = lastTypeHash !== currentTypeHash;
              // lastTypeHash = currentTypeHash;

              const type = doc.type || doc.title;
              const tokenizedType = tokenize(type);
              const hash = `${tokenizedType}-${tokenize(doc.title)}`;
              const typeHash = `${tokenizedType}-${tokenizedType}`;
    
              const isFirstOfType = type !== lastType;
              lastType = type;
    
              const typeLength = docsTypesLength[type];

              return (
                <Wrapper key={index}>
                  {isFirstOfType && typeLength && <Anchor id={typeHash} data-scrollspy-node-type="groupOfDocuments" />}
                  <ContentHeader id={hash} data-scrollspy-node-type={typeLength ? "document" : "groupOfDocuments"}>{doc.title}</ContentHeader>
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
        </div>
      )}
    </div>
  );
};

export default DocsContent;
