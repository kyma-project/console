import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AsyncApi from '@kyma-project/asyncapi-react';
import ODataReact from '@kyma-project/odata-react';
import {
  Markdown,
  ReactMarkdown,
  Tabs,
  Tab,
} from '@kyma-project/react-components';

import ApiConsole from '../SwaggerApi/SwaggerApiConsole.component';

import { ServiceInstanceTabsContentWrapper } from './styled';

import {
  validateContent,
  compareTwoObjects,
  processDocFilename,
  sortDocumentsByType,
} from '../../../commons/helpers';

import { asyncApiConfig, asyncApiTheme } from '../../../commons/asyncapi';

const validatDocumentsByType = type => {
  let numberOfSources = 0;
  for (let item = 0; item < type.length; item++) {
    if (type[item].source || type[item].Source) numberOfSources++;
  }
  return numberOfSources > 0;
};

class ServiceInstanceTabs extends Component {
  state = {
    docsData: null,
    openApiSpec: null,
    asyncApiSpec: null,
    error: null,
  };

  async componentDidMount() {
    const { serviceClass } = this.props;

    if (serviceClass) {
      await this.setDocs(serviceClass);
      await this.setOpenApiSpec(serviceClass);
      await this.setAsyncApiSpec(serviceClass);
    }
  }

  async componentDidUpdate(prevProps, _) {
    const { serviceClass } = this.props;
    if (
      serviceClass &&
      !compareTwoObjects(serviceClass, prevProps.serviceClass)
    ) {
      await this.setDocs(serviceClass);
      await this.setOpenApiSpec(serviceClass);
      await this.setAsyncApiSpec(serviceClass);
    }
  }

  async setDocs(docs) {
    const markdownFiles =
      docs &&
      docs.clusterDocsTopic &&
      docs.clusterDocsTopic.assets &&
      docs.clusterDocsTopic.assets.filter(elem => elem.type === 'markdown');
    const data =
      markdownFiles &&
      markdownFiles.length &&
      markdownFiles[0] &&
      markdownFiles[0].files.filter(el => el.url.endsWith('.md'));

    if (data) {
      this.setState({
        docsData: await this.getAllUrls(data),
      });
    }
  }

  async setAsyncApiSpec(data) {
    const specFile =
      data &&
      data.clusterDocsTopic &&
      data.clusterDocsTopic.assets.filter(elem => elem.type === 'asyncapi');
    if (
      specFile &&
      specFile[0] &&
      specFile[0].files &&
      specFile[0].files[0] &&
      specFile[0].files[0].url
    ) {
      console.log(specFile[0].files[0].url);
      this.setState({
        asyncApiSpec: await this.getAsyncApiSpec(specFile[0].files[0].url),
      });
    }
  }

  async setOpenApiSpec(data) {
    const specFile =
      data &&
      data.clusterDocsTopic &&
      data.clusterDocsTopic.assets.filter(elem => elem.type === 'openapi');
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
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw Error(`${response.status}: ${response.statusText}`);
          }
        })
        .then(text => {
          return {
            metadata: link.metadata,
            url: link.url,
            source: text,
          };
        })
        .catch(err => {
          this.setState({
            error: err,
          });
        });
    return data;
  }

  async getAsyncApiSpec(link) {
    const data =
      link &&
      fetch(link)
        .then(response => {
          if (response.ok) {
            return response.text();
          } else {
            throw Error(`${response.status}: ${response.statusText}`);
          }
        })
        .then(text => {
          return {
            metadata: link.metadata,
            url: link.url,
            source: text,
          };
        })
        .catch(err => {
          this.setState({
            error: err,
          });
        });
    return data;
  }

  async getAllUrls(docs) {
    const data = await Promise.all(
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
    const { serviceClass } = this.props;
    console.log(serviceClass);
    //data from new api
    const { docsData, openApiSpec, asyncApiSpec, error } = this.state;

    if (error) {
      return <div>{error}</div>;
    }

    //data ffrom deprecated api
    const deprecatedContent = serviceClass.content && serviceClass.content;
    const deprecatedOpenApiSpec =
      serviceClass.openApiSpec && serviceClass.openApiSpec;
    const deprecatedAsyncApiSpec =
      serviceClass.asyncApiSpec && serviceClass.asyncApiSpec;
    const deprecatedOdataSpec =
      serviceClass.odataSpec && serviceClass.odataSpec;

    if (
      (docsData && docsData.length) ||
      (openApiSpec && openApiSpec.source) ||
      (asyncApiSpec && asyncApiSpec.source) ||
      (deprecatedContent &&
        Object.keys(deprecatedContent).length &&
        validateContent(deprecatedContent)) ||
      (deprecatedOpenApiSpec && Object.keys(deprecatedOpenApiSpec).length) ||
      (deprecatedAsyncApiSpec && Object.keys(deprecatedAsyncApiSpec).length) ||
      (deprecatedOdataSpec && Object.keys(deprecatedOdataSpec).length)
    ) {
      let documentsByType = [],
        documentsTypes = [];

      if (!serviceClass.loading) {
        if (deprecatedContent && Object.keys(deprecatedContent).length) {
          documentsByType = sortDocumentsByType(deprecatedContent);
          documentsTypes = Object.keys(documentsByType);
        }
      }

      const deprecatedDocs =
        documentsTypes &&
        documentsTypes.map(type =>
          documentsByType &&
          documentsByType[type] &&
          validatDocumentsByType(documentsByType[type]) ? (
            <Tab key={type} title={type}>
              <Markdown>
                {documentsByType[type].map((item, i) => {
                  return item.source || item.Source ? (
                    <div
                      key={i}
                      dangerouslySetInnerHTML={{
                        __html: item.source || item.Source,
                      }}
                    />
                  ) : null;
                })}
              </Markdown>
            </Tab>
          ) : null,
        );

      const docsFromNewApi = docsData
        ? docsData.map(type => (
            <Tab
              title={
                (type.metadata && type.metadata.title) ||
                processDocFilename(type.url)
              }
              key={type.url}
            >
              <ReactMarkdown source={type.source} />
            </Tab>
          ))
        : null;
      return (
        <ServiceInstanceTabsContentWrapper>
          <Tabs>
            {docsData && docsData.length ? docsFromNewApi : deprecatedDocs}
            {(openApiSpec && openApiSpec.source) ||
            (deprecatedOpenApiSpec &&
              Object.keys(deprecatedOpenApiSpec).length) ? (
              <Tab title={'Console'}>
                <ApiConsole
                  url="http://petstore.swagger.io/v1/swagger.json"
                  schema={openApiSpec.source || deprecatedOpenApiSpec}
                />
              </Tab>
            ) : null}
            {(asyncApiSpec && asyncApiSpec.source) ||
            (deprecatedAsyncApiSpec &&
              Object.keys(deprecatedAsyncApiSpec).length) ? (
              <Tab title={'Events'} margin="0" background="inherit">
                <AsyncApi
                  schema={
                    (asyncApiSpec && asyncApiSpec.source) ||
                    deprecatedAsyncApiSpec
                  }
                  theme={asyncApiTheme}
                  config={asyncApiConfig}
                />
              </Tab>
            ) : null}
            {deprecatedOdataSpec && Object.keys(deprecatedOdataSpec).length ? (
              <Tab title={'OData'} margin="0" background="inherit">
                <ODataReact schema={deprecatedOdataSpec} />
              </Tab>
            ) : null}
          </Tabs>
        </ServiceInstanceTabsContentWrapper>
      );
    }

    return null;
  }
}

ServiceInstanceTabs.propTypes = {
  serviceClass: PropTypes.object.isRequired,
};

export default ServiceInstanceTabs;
