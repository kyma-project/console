import React, { Component } from 'react';
import { Toolbar } from '@kyma-project/react-components';

import DocsContent from './DocsContent.component';
import deepEqual from 'deep-equal';

import { DocsWrapper } from './styled';

export default class DocsContentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { docs: null, error: null };
  }

  async componentDidMount() {
    const { docs } = this.props;
    if (docs) {
      await this.setDocs(docs);
    }
  }

  async componentDidUpdate(prevProps, _) {
    const { docs } = this.props;
    if (docs && !deepEqual(docs, prevProps.docs)) {
      await this.setDocs(docs);
    }
  }

  async setDocs(docs) {
    this.setState({
      displayName: docs.displayName,
      docs: await Promise.all(
        docs.assets.map(elem => this.getAllUrls(elem.files)),
      ),
    });
  }

  async getAllUrls(docs) {
    const data = await Promise.all(
      docs.map(doc =>
        fetch(doc.url)
          .then(response => {
            return response.text();
          })
          .then(text => {
            return {
              source: {
                type: 'md',
                rawContent: text,
                data: {
                  frontmatter: doc.metadata,
                  url: doc.url,
                },
              },
            };
          })
          .catch(err => {
            throw err;
          }),
      ),
    ).catch(err => {
      this.setState({
        error: err,
      });
    });
    return data;
  }

  render() {
    const { docs } = this.props;
    const { docs: sources, displayName } = this.state;

    if (!docs || !sources) {
      return null;
    }

    return (
      <>
        <DocsWrapper>
          {displayName && (
            <Toolbar title={displayName} customPadding={'28px 0'} />
          )}
          {sources.flatMap((component, index) => {
            let newDocs = component;
            let docsTypesLength = {};
            if (newDocs) {
              newDocs.forEach(doc => {
                if (!doc.metadata) return;

                const type = doc.metadata.type || doc.metadata.title;
                if (!(type in docsTypesLength)) {
                  docsTypesLength[type] = 0;
                }
                if (doc.metadata.title) {
                  docsTypesLength[type]++;
                }
              });
            }

            return (
              <DocsContent
                key={index}
                docs={newDocs}
                error={this.state.error}
                displayName={this.state.displayName}
                docsTypesLength={docsTypesLength}
                docsLoaded={this.props.docsLoaded}
                setDocsInitialLoadStatus={this.props.setDocsInitialLoadStatus}
              />
            );
          })}
        </DocsWrapper>
      </>
    );
  }
}
