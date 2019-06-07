import React, { Component } from 'react';
import PropTypes from 'prop-types';
import deepEqual from 'deep-equal';
import AsyncApi from '@kyma-project/asyncapi-react';
import ODataReact from '@kyma-project/odata-react';
import {
  NotificationMessage,
  ReactMarkdown,
  Status,
  StatusWrapper,
  Tabs,
  Tab,
} from '@kyma-project/react-components';

import ApiReference from '../SwaggerApi/SwaggerApiReference.component';
import { ServiceClassInstancesTable } from '../ServiceClassInstancesTable/ServiceClassInstancesTable.component';

import {
  ServiceClassTabsContentWrapper,
  TabErrorMessageWrapper,
} from './styled';

import { serviceClassConstants, serviceClassTabs } from '../../../variables';
import { processDocFilename, DocsProcessor } from '../../../commons/helpers';
import { asyncApiConfig, asyncApiTheme } from '../../../commons/asyncapi';

class ServiceClassTabs extends Component {
  state = {
    docsData: null,
    openApiSpec: null,
    asyncapi: null,
    odata: null,
    fetchError: {
      docsData: null,
      openApiSpec: null,
      asyncapi: null,
      odata: null,
    },
  };

  async componentDidMount() {
    const { serviceClass } = this.props;
    if (serviceClass) {
      Promise.all([
        await this.setDocs(serviceClass),
        await this.setOpenApiSpec(serviceClass),
        await this.setAsyncApiOrOdataSpec(serviceClass, 'asyncapi'),
        await this.setAsyncApiOrOdataSpec(serviceClass, 'odata'),
      ]);
    }
  }

  async componentDidUpdate(prevProps, _) {
    const { serviceClass } = this.props;
    if (serviceClass && !deepEqual(serviceClass, prevProps.serviceClass)) {
      Promise.all([
        await this.setDocs(serviceClass),
        await this.setOpenApiSpec(serviceClass),
        await this.setAsyncApiOrOdataSpec(serviceClass, 'asyncapi'),
        await this.setAsyncApiOrOdataSpec(serviceClass, 'odata'),
      ]);
    }
  }

  async setDocs(docs) {
    const properDocsTopic = docs && (docs.docsTopic || docs.clusterDocsTopic);

    const markdownFiles =
      properDocsTopic &&
      properDocsTopic.assets &&
      properDocsTopic.assets.filter(elem => elem.type === 'markdown');
    const data =
      markdownFiles &&
      markdownFiles.length &&
      markdownFiles[0] &&
      markdownFiles[0].files
        .filter(el => el.url.endsWith('.md'))
        .sort((first, sec) => {
          const firstData = (
            first.metadata.title || first.metadata.type
          ).toLowerCase();

          const secondData = (
            sec.metadata.title || sec.metadata.type
          ).toLowerCase();

          return firstData === 'overview'
            ? -1
            : secondData === 'overview'
            ? 1
            : 0;
        });

    if (data) {
      this.setState({
        docsData: await this.getDocsUrls(data),
      });
    }
  }

  async setAsyncApiOrOdataSpec(data, spec) {
    const properDocsTopic = data && (data.docsTopic || data.clusterDocsTopic);

    const specFile =
      properDocsTopic &&
      properDocsTopic.assets &&
      Array.isArray(properDocsTopic.assets) &&
      properDocsTopic.assets.filter(elem => elem.type === spec);

    const urlToSpecFile =
      specFile &&
      specFile[0] &&
      specFile[0].files &&
      specFile[0].files[0] &&
      specFile[0].files[0].url;
    if (
      !(
        (spec === 'odata' && urlToSpecFile && urlToSpecFile.endsWith('.xml')) ||
        (spec === 'asyncapi' && urlToSpecFile)
      )
    ) {
      return null;
    }

    this.setState({
      [spec]: await this.getAsyncApiOrOdataSpec(urlToSpecFile, spec),
    });
  }

  async setOpenApiSpec(data) {
    const properDocsTopic = data && (data.docsTopic || data.clusterDocsTopic);
    let specFile =
      properDocsTopic &&
      properDocsTopic.assets &&
      Array.isArray(properDocsTopic.assets) &&
      properDocsTopic.assets.filter(elem => elem.type === 'openapi');

    if (
      specFile &&
      specFile[0] &&
      specFile[0].files &&
      specFile[0].files[0] &&
      specFile[0].files[0].url
    ) {
      this.setState({
        openApiSpec: await this.getOpenApiSpec(specFile[0].files[0].url),
      });
    }
  }

  async getOpenApiSpec(link) {
    const data =
      link &&
      fetch(link)
        .then(response => response.json())
        .then(text => {
          return {
            metadata: link.metadata,
            url: link.url,
            source: text,
          };
        })
        .catch(err => {
          this.setState(previousState => ({
            ...previousState,
            fetchError: {
              ...previousState.fetchError,
              openApiSpec: err,
            },
          }));
        });
    return data;
  }

  async getAsyncApiOrOdataSpec(link, spec) {
    const data =
      link &&
      fetch(link)
        .then(response => response.text())
        .then(text => {
          return {
            metadata: link.metadata,
            url: link.url,
            source: text,
          };
        })
        .catch(err => {
          this.setState(previousState => ({
            ...previousState,
            fetchError: {
              ...previousState.fetchError,
              [spec]: err,
            },
          }));
        });
    return data;
  }

  async getDocsUrls(docs) {
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
      this.setState(previousState => ({
        ...previousState,
        fetchError: {
          ...previousState.fetchError,
          docsData: err,
        },
      }));
    });
    return data;
  }

  getTabElementsIndicator(instancesCount) {
    return (
      <StatusWrapper key="instances-no">
        <Status>{instancesCount}</Status>
      </StatusWrapper>
    );
  }

  render() {
    const { serviceClass } = this.props;
    const { docsData, openApiSpec, asyncapi, odata, fetchError } = this.state;

    if (
      (docsData && docsData.length) ||
      (openApiSpec && openApiSpec.source) ||
      (odata && odata.source) ||
      (asyncapi && asyncapi.source) ||
      (serviceClass.instances && serviceClass.instances.length)
    ) {
      const newDocs = docsData
        ? new DocsProcessor(docsData)
            .removeMatadata()
            .replaceImagePaths()
            .result()
        : null;

      const docsFromNewApi = !newDocs
        ? null
        : newDocs.map(type => (
            <Tab
              title={
                (type.metadata && type.metadata.title) ||
                processDocFilename(type.url)
              }
              key={type.url}
            >
              {type && type.source && <ReactMarkdown source={type.source} />}
            </Tab>
          ));

      let error = Object.keys(fetchError).filter(key => fetchError[key]);
      error = error.length ? fetchError[error[0]] : null;

      return (
        <>
          {error && (
            <TabErrorMessageWrapper>
              <NotificationMessage
                customMargin={'0'}
                type="error"
                title={error.name}
                message={error.message}
              />
            </TabErrorMessageWrapper>
          )}

          <ServiceClassTabsContentWrapper>
            <Tabs>
              {!fetchError.docsData && docsData && docsData.length
                ? docsFromNewApi
                : null}
              {!fetchError.openApiSpec && openApiSpec && openApiSpec.source ? (
                <Tab title={serviceClassTabs.openApi}>
                  <ApiReference
                    url="http://petstore.swagger.io/v1/swagger.json"
                    schema={openApiSpec.source}
                  />
                </Tab>
              ) : null}
              {!fetchError.asyncapi && asyncapi && asyncapi.source ? (
                <Tab
                  title={serviceClassTabs.asyncApi}
                  margin="0"
                  background="inherit"
                >
                  <AsyncApi
                    schema={asyncapi && asyncapi.source}
                    theme={asyncApiTheme}
                    config={asyncApiConfig}
                  />
                </Tab>
              ) : null}
              {!fetchError.odata && odata && odata.source ? (
                <Tab
                  title={serviceClassTabs.odata}
                  margin="0"
                  background="inherit"
                >
                  <ODataReact schema={odata.source} />
                </Tab>
              ) : null}
              {serviceClass.instances && serviceClass.instances.length ? (
                <Tab
                  aditionalStatus={this.getTabElementsIndicator(
                    this.props.serviceClass.instances.length,
                  )}
                  title={serviceClassConstants.instancesTabText}
                  noMargin
                >
                  <ServiceClassInstancesTable
                    tableData={this.props.serviceClass.instances}
                  />
                </Tab>
              ) : null}
            </Tabs>
          </ServiceClassTabsContentWrapper>
        </>
      );
    }
    return null;
  }
}

ServiceClassTabs.propTypes = {
  serviceClass: PropTypes.object.isRequired,
};

export default ServiceClassTabs;
