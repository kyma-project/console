import React, { Component } from 'react';

import DocsContent from './DocsContent.component';
import { DocsProcessor } from './DocsProcessor';

import { compareTwoObjects } from '../../commons/helpers';

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

    if (!compareTwoObjects(this.props.docs, prevProps.docs) && docs) {
      await this.setDocs(docs);
    }
  }

  async setDocs(docs) {
    this.setState({
      displayName: docs.displayName,
      docs: await this.getAllUrls(docs.assets[0].files),
    });
  }

  async getAllUrls(docs) {
    var data = await Promise.all(
      docs.map(doc =>
        fetch(doc.url)
          .then(response => {
            if (response.ok) {
              return response.text();
            } else {
              throw Error(`${response.status}: ${response.statusText}`);
            }
          })
          .then(text => {
            return {
              metadata: doc.metadata,
              url: doc.url,
              source: text,
            };
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
    const sources = this.state.docs;

    if (!docs) {
      return null;
    }

    let newDocs = sources;
    let docsTypesLength = {};

    if (newDocs) {
      newDocs = new DocsProcessor(sources)
        .replaceImagePaths()
        .removeMatadata()
        .result();

      newDocs.map(doc => {
        if (!doc.metadata) return doc;

        const type = doc.metadata.type || doc.metadata.title;
        if (!(type in docsTypesLength)) {
          docsTypesLength[type] = 0;
        }
        if (doc.metadata.title) docsTypesLength[type]++;

        return doc;
      });
    }

    return (
      <DocsContent
        docs={newDocs}
        error={this.state.error}
        displayName={this.state.displayName}
        docsTypesLength={docsTypesLength}
        docsLoaded={this.props.docsLoaded}
        setDocsInitialLoadStatus={this.props.setDocsInitialLoadStatus}
      />
    );
  }
}
