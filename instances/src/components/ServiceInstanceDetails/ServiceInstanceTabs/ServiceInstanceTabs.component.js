import React from 'react';
import PropTypes from 'prop-types';

import AsyncApi from '@kyma-project/asyncapi-react';
import ODataReact from '@kyma-project/odata-react';
import { Markdown, Tabs, Tab } from '@kyma-project/react-components';

import ApiConsole from '../SwaggerApi/SwaggerApiConsole.component';

import { ServiceInstanceTabsContentWrapper } from './styled';

import {
  sortDocumentsByType,
  validateContent,
} from '../../../commons/helpers';

import { asyncApiConfig, asyncApiTheme } from '../../../commons/asyncapi';

const ServiceInstanceTabs = ({ serviceClass }) => {
  const content = serviceClass.content && serviceClass.content;
  const openApiSpec = serviceClass.openApiSpec && serviceClass.openApiSpec;
  const asyncApiSpec = serviceClass.asyncApiSpec && serviceClass.asyncApiSpec;
  const odataSpec = serviceClass.odataSpec && serviceClass.odataSpec;

  if (
    (content && Object.keys(content).length && validateContent(content)) ||
    (openApiSpec && Object.keys(openApiSpec).length) ||
    (asyncApiSpec && Object.keys(asyncApiSpec).length) ||
    (odataSpec && Object.keys(odataSpec).length)
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
              <AsyncApi schema={asyncApiSpec} theme={asyncApiTheme} config={asyncApiConfig} />
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
};

ServiceInstanceTabs.propTypes = {
  serviceClass: PropTypes.object.isRequired,
};

export default ServiceInstanceTabs;
