import React from 'react';
import PropTypes from 'prop-types';

import AsyncApi from '@kyma-project/asyncapi-react';
import { Markdown, Tabs, Tab } from '@kyma-project/react-components';

import ApiConsole from '../SwaggerApi/SwaggerApiConsole.component';

import { ServiceInstanceTabsContentWrapper } from './styled';

import { sortDocumentsByType, validateContent } from '../../../commons/helpers';

import { asyncApiConfig, asyncApiTheme } from '../../../commons/asyncapi';

const ServiceInstanceTabs = ({ serviceClass }) => {
  const content = serviceClass.content && serviceClass.content;
  const apiSpec = serviceClass.apiSpec && serviceClass.apiSpec;
  const asyncApiSpec = serviceClass.asyncApiSpec && serviceClass.asyncApiSpec;

  if (
    (content && Object.keys(content).length && validateContent(content)) ||
    (apiSpec && Object.keys(apiSpec).length) ||
    (asyncApiSpec && Object.keys(asyncApiSpec).length)
  ) {
    let documentsByType = [],
      documentsTypes = [];

    if (!serviceClass.loading) {
      if (content && Object.keys(content).length) {
        documentsByType = sortDocumentsByType(content);
        documentsTypes = Object.keys(documentsByType);
      }
    }

    const validatDocumentsByType = type => {
      let numberOfSources = 0;
      for (let item = 0; item < type.length; item++) {
        if (type[item].source || type[item].Source) numberOfSources++;
      }
      return numberOfSources > 0;
    };

    return (
      <ServiceInstanceTabsContentWrapper>
        <Tabs>
          {documentsTypes &&
            documentsTypes.map(
              type =>
                documentsByType &&
                documentsByType[type] &&
                validatDocumentsByType(documentsByType[type]) ? (
                  <Tab key={type} title={type}>
                    <Markdown>
                      {documentsByType[type].map(
                        (item, i) =>
                          item.source || item.Source ? (
                            <div
                              key={i}
                              dangerouslySetInnerHTML={{
                                __html: item.source || item.Source,
                              }}
                            />
                          ) : null,
                      )}
                    </Markdown>
                  </Tab>
                ) : null,
            )}

          {apiSpec && Object.keys(apiSpec).length ? (
            <Tab title={'Console'}>
              <ApiConsole
                url="http://petstore.swagger.io/v1/swagger.json"
                schema={apiSpec}
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
        </Tabs>
      </ServiceInstanceTabsContentWrapper>
    );
  }

  return null;
};

ServiceInstanceTabs.propTypes = {
  serviceClass: PropTypes.object.isRequired,
};

export default ServiceInstanceTabs;
