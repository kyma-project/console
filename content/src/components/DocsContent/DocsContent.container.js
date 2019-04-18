import React, { Component } from 'react';

import DocsContent from './DocsContent.component';
import { DocsProcessor } from './DocsProcessor';
import deepEqual from 'deep-equal';

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
              metadata: doc.metadata,
              url: doc.url,
              source: text,
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
    const { docs: sources } = this.state;

    if (!docs || !sources) {
      return null;
    }

    return (
      <>
        {sources.flatMap((component, index) => {
          let newDocs = component;
          let docsTypesLength = {};
          if (newDocs) {
            newDocs = new DocsProcessor(component)
              .replaceImagePaths()
              .removeMatadata()
              .result();

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
              displayName={index === 0 ? this.state.displayName : null}
              docsTypesLength={docsTypesLength}
              docsLoaded={this.props.docsLoaded}
              setDocsInitialLoadStatus={this.props.setDocsInitialLoadStatus}
            />
          );
        })}
      </>
    );

    // if (newDocs) {
    //   newDocs = new DocsProcessor(sources)
    //     .replaceImagePaths()
    //     .removeMatadata()
    //     .result();

    //   newDocs.forEach(doc => {
    //     if (!doc.metadata) return doc;

    //     const type = doc.metadata.type || doc.metadata.title;
    //     if (!(type in docsTypesLength)) {
    //       docsTypesLength[type] = 0;
    //     }
    //     if (doc.metadata.title) {
    //       docsTypesLength[type]++;
    //     }

    //     return doc;
    //   });
    // }

    // return (
    //   <DocsContent
    //     docs={newDocs}
    //     error={this.state.error}
    //     displayName={this.state.displayName}
    //     docsTypesLength={docsTypesLength}
    //     docsLoaded={this.props.docsLoaded}
    //     setDocsInitialLoadStatus={this.props.setDocsInitialLoadStatus}
    //   />
    // );
  }
}
