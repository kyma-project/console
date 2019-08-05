import React, { Component } from 'react';
import { GenericComponent } from '@kyma-project/generic-documentation';
import { NotificationMessage, Spinner } from '@kyma-project/react-components';

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
    let { docs, docsLoaded, error, docsTopic } = this.props;

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

    if (!docs || !docs.length) {
      return null;
    }

    return <GenericComponent docsTopic={docsTopic} layout="content-ui" />;
  }
}

export default DocsContent;
