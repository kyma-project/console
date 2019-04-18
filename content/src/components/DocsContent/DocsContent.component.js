import React, { Component } from 'react';
import {
  NotificationMessage,
  ReactMarkdown,
  Toolbar,
  Spinner,
} from '@kyma-project/react-components';

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
    this.setDocsStatusIfShould();
  }

  componentDidUpdate() {
    this.setDocsStatusIfShould();
  }

  setDocsStatusIfShould = () => {
    const { docsLoaded, setDocsInitialLoadStatus, docs, error } = this.props;

    if (docsLoaded || !(docs || error)) {
      return null;
    }
    setDocsInitialLoadStatus();
  };

  render() {
    let { displayName, docs, docsLoaded, docsTypesLength, error } = this.props;
    let lastType = '';

    if (!docsLoaded) {
      return <Spinner />;
    }

    if (!error && (!docs || !docs.length || docs.length === 0)) {
      return (
        <NotificationMessage
          type="error"
          title="Error"
          message={'No documentation found'}
        />
      );
    }

    if (error) {
      return (
        <NotificationMessage
          type="error"
          title="Error"
          message={error.message}
        />
      );
    }

    return (
      <>
        <DocsWrapper>
          {displayName && (
            <Toolbar title={displayName} customPadding={'28px 0'} />
          )}

          {docs.map((doc, index) => {
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
                  {doc.metadata.title}
                </ContentHeader>
                <ContentDescription>
                  <TextWrapper>
                    {doc && doc.source && <ReactMarkdown source={doc.source} />}
                  </TextWrapper>
                </ContentDescription>
              </Wrapper>
            );
          })}
        </DocsWrapper>
      </>
    );
  }
}

export default DocsContent;
