import React from 'react';
import PropTypes from 'prop-types';

import { Tabs, Tab } from '@kyma-project/react-components';

import Events from '../Events/Events.component';
import ApiReference from '../SwaggerApi/SwaggerApiReference.component';

import { ServiceClassTabsContentWrapper } from './styled';

import { sortDocumentsByType } from '../../../commons/helpers';

const ServiceClassTabs = ({ serviceClass }) => {
  const apiSpec =
    serviceClass.serviceClass.apiSpec && serviceClass.serviceClass.apiSpec;
  const asyncApiSpec =
    serviceClass.serviceClass.asyncApiSpec &&
    serviceClass.serviceClass.asyncApiSpec;

  let documentsByType = [],
    documentsTypes = [],
    eventsTopics = [];

  if (!serviceClass.loading) {
    if (serviceClass.serviceClass.content) {
      documentsByType = sortDocumentsByType(serviceClass.serviceClass.content);
      documentsTypes = Object.keys(documentsByType);
    }
    if (asyncApiSpec && asyncApiSpec.topics) {
      eventsTopics = Object.keys(asyncApiSpec.topics);
    }
  }

  return (
    <ServiceClassTabsContentWrapper>
      <Tabs>
        {documentsTypes &&
          documentsTypes.map(type => (
            <Tab key={type} title={type}>
              {documentsByType &&
                documentsByType[type] &&
                documentsByType[type].map((item, i) => (
                  <div
                    key={i}
                    dangerouslySetInnerHTML={{
                      __html: item.source || item.Source,
                    }}
                  />
                ))}
            </Tab>
          ))}

        {apiSpec && (
          <Tab title={'Console'}>
            <ApiReference
              url="http://petstore.swagger.io/v1/swagger.json"
              schema={apiSpec}
            />
          </Tab>
        )}

        {asyncApiSpec && (
          <Tab title={'Events'}>
            <Events
              data={asyncApiSpec.topics}
              topics={eventsTopics}
              title={asyncApiSpec.info.title}
              description={asyncApiSpec.info.description}
            />
          </Tab>
        )}
      </Tabs>
    </ServiceClassTabsContentWrapper>
  );
};

ServiceClassTabs.propTypes = {
  serviceClass: PropTypes.object.isRequired,
};

export default ServiceClassTabs;
