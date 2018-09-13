import React from 'react';
import PropTypes from 'prop-types';

import { Tabs, Tab } from '@kyma-project/react-components';

import Events from '../Events/Events.component';
import ApiReference from '../SwaggerApi/SwaggerApiReference.component';

import { ServiceClassTabsContentWrapper } from './styled';

import {
  sortDocumentsByType,
  validateContent,
  validateAsyncApiSpec,
} from '../../../commons/helpers';

const ServiceClassTabs = ({ serviceClass }) => {
  const content =
    serviceClass.serviceClass.content && serviceClass.serviceClass.content;
  const apiSpec =
    serviceClass.serviceClass.apiSpec && serviceClass.serviceClass.apiSpec;
  const asyncApiSpec =
    serviceClass.serviceClass.asyncApiSpec &&
    serviceClass.serviceClass.asyncApiSpec;

  if (
    (content && Object.keys(content).length && validateContent(content)) ||
    (apiSpec && Object.keys(apiSpec).length) ||
    (asyncApiSpec &&
      Object.keys(asyncApiSpec).length &&
      validateAsyncApiSpec(asyncApiSpec))
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
        if (!!type[item].source || !!type[item].Source) numberOfSources++;
      }
      return numberOfSources > 0;
    };

    return (
      <ServiceClassTabsContentWrapper>
        <Tabs>
          {documentsTypes &&
            documentsTypes.map(
              type =>
                documentsByType &&
                documentsByType[type] &&
                validatDocumentsByType(documentsByType[type]) ? (
                  <Tab key={type} title={type}>
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
                  </Tab>
                ) : null,
            )}

          {apiSpec &&
            Object.keys(apiSpec).length && (
              <Tab title={'Console'}>
                <ApiReference
                  url="http://petstore.swagger.io/v1/swagger.json"
                  schema={apiSpec}
                />
              </Tab>
            )}

          {asyncApiSpec &&
          Object.keys(asyncApiSpec).length &&
          validateAsyncApiSpec(asyncApiSpec) ? (
            <Tab title={'Events'}>
              <Events asyncApiSpec={asyncApiSpec} />
            </Tab>
          ) : null}
        </Tabs>
      </ServiceClassTabsContentWrapper>
    );
  }

  return null;
};

ServiceClassTabs.propTypes = {
  serviceClass: PropTypes.object.isRequired,
};

export default ServiceClassTabs;
