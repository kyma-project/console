import React from 'react';

import DocsContent from './DocsContent.component';
import { DocsProcessor } from './DocsProcessor';

import { compareTwoObjects } from '../../commons/helpers';

export default class DocsContentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { docs: null }
  }

  async componentDidMount() {
    const { docs } = this.props;

    if(docs) {
      this.setState({ 
        displayName: docs.displayName,
        docs: await this.getAllUrls(docs.assets[0].files) 
      })
    };
  }

  async componentDidUpdate(prevProps, _) {
    const { docs } = this.props;

    if (!compareTwoObjects(this.props.docs, prevProps.docs) && docs ) {
      this.setState({ 
        displayName: docs.displayName,
        docs: await this.getAllUrls(docs.assets[0].files) 
      })
    }
    
  }  
  async getAllUrls(docs) {
    try {
      var data = await Promise.all(
        docs.map(
          doc =>
          fetch(doc.url).then((response) => response.text()).then((text) => {
            return {
              metadata: doc.metadata,
              url: doc.url,
              source: text
            }
          })
        )
      );
      return (data)
    } catch (error) {
      console.log(error)
      throw (error)
    }
  }

  render() {
    const { docs } = this.props;
    const sources = this.state.docs;

    if (!docs) {
      return null;
    }

    let newDocs = sources;
    let docsTypesLength = {};

    if(newDocs){
      newDocs = new DocsProcessor(sources)
      .replaceImagePaths()
      .removeMatadata()
      .result();

      newDocs.map(doc => {
        const type = doc.metadata.type || doc.metadata.title;
        if (!(type in docsTypesLength)) {
          docsTypesLength[type] = 0;
        }
        if (doc.metadata.title) docsTypesLength[type]++;

        return doc;
      });
    }

    return <DocsContent docs={newDocs} displayName={this.state.displayName} docsTypesLength={docsTypesLength} docsLoaded={this.props.docsLoaded} setDocsInitialLoadStatus={this.props.setDocsInitialLoadStatus} />;
  }
};