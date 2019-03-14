import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
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

class DocsContent extends Component {
  componentDidMount() {
    this.setDocsStatus();
  }

  componentDidUpdate() {
    this.setDocsStatus();
  }

  setDocsStatus = () => {
    const { docsLoaded, setDocsInitialLoadStatus, docs } = this.props;
    if(!docsLoaded && docs){
      setDocsInitialLoadStatus();
    }
  }

  render() {
    const { displayName, docs, docsTypesLength } = this.props;  

    let lastType = '';

    return (
      <>
        {docs && docs.length>0 && 
          <DocsWrapper>
            <Toolbar title={displayName} customPadding={'28px 0'} />
            
            {docs.map((doc, index) =>  {
              const type = doc.metadata.type || doc.metadata.title;
              const tokenizedType = tokenize(type);
              const hash = `${tokenizedType}-${tokenize(doc.metadata.title)}`;
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
                  .{doc.metadata.title}
                </ContentHeader>
                <ContentDescription>
                  <TextWrapper>
                    <Markdown>
                      <ReactMarkdown source={doc.source} />
                    </Markdown>
                  </TextWrapper>
                </ContentDescription>
              </Wrapper>
              )
            })}
          </DocsWrapper>
        }
      </>
    );
  };
};

export default DocsContent;
