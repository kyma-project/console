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
  sortDocumentsByType,
  validateContent,
  compareTwoObjects,
  processDocFilename,
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
    data: null,
    error: null,
  };

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
      data: await this.getAllUrls(docs.assets[0].files),
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
    const { serviceClass } = this.props;
    const { data } = this.state;
    const content = serviceClass.content && serviceClass.content;
    const openApiSpec = serviceClass.openApiSpec && serviceClass.openApiSpec;
    const asyncApiSpec = serviceClass.asyncApiSpec && serviceClass.asyncApiSpec;
    const odataSpec = serviceClass.odataSpec && serviceClass.odataSpec;

    if (
      (data && data.length) ||
      (content && Object.keys(content).length && validateContent(content)) ||
      (openApiSpec && Object.keys(openApiSpec).length) ||
      (asyncApiSpec && Object.keys(asyncApiSpec).length) ||
      (odataSpec && Object.keys(odataSpec).length)
    ) {
      let documentsByType = [],
        documentsTypes = [];

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

      const docsFromNewApi = data
        ? data.map(type => {
            const capitalizedFilename = processDocFilename(type.url);
            return (
              <Tab
                title={type.metadata.title || capitalizedFilename}
                key={type.url}
              >
                <ReactMarkdown source={type.source} />
              </Tab>
            );
          })
        : null;

      return (
        <ServiceInstanceTabsContentWrapper>
          <Tabs>
            <Tab title="asd">asdasda</Tab>
            <Tab title="asssss">asdasdaasdasd</Tab>
            {data && data.length ? docsFromNewApi : deprecatedDocs}

            {openApiSpec && Object.keys(openApiSpec).length ? (
              <Tab title={'Console'}>
                <ApiConsole
                  url="http://petstore.swagger.io/v1/swagger.json"
                  schema={openApiSpec}
                />
              </Tab>
            ) : null}

            {asyncApiSpec && Object.keys(asyncApiSpec).length ? (
              <Tab title={'Events'} margin="0" background="inherit">
                <AsyncApi
                  schema={asyncApiSpec}
                  theme={asyncApiTheme}
                  config={asyncApiConfig}
                />
              </Tab>
            ) : null}

            {odataSpec && Object.keys(odataSpec).length ? (
              <Tab title={'OData'} margin="0" background="inherit">
                <ODataReact schema={odataSpec} />
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
