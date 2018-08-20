import React from 'react';

import { Tabs, Tab } from '@kyma-project/react-components';

import Events from '../Events/Events.component';
import ApiConsole from '../SwaggerApi/SwaggerApiConsole.component';

import { ServiceInstanceTabsContentWrapper } from './styled';

import { sortDocumentsByType } from '../../../commons/helpers';

const ServiceInstanceTabs = ({ serviceClass }) => {
  const apiSpec = serviceClass.apiSpec && serviceClass.apiSpec;
  const asyncApiSpec = serviceClass.asyncApiSpec && serviceClass.asyncApiSpec;

  let documentsByType = [],
    documentsTypes = [],
    eventsTopics = [];

  if (serviceClass.content) {
    documentsByType = sortDocumentsByType(serviceClass.content);
    documentsTypes = Object.keys(documentsByType);
  }
  if (asyncApiSpec && asyncApiSpec.topics) {
    eventsTopics = Object.keys(asyncApiSpec.topics);
  }

  return (
    <ServiceInstanceTabsContentWrapper>
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
            {/* CHANGE URL */}
            <ApiConsole
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
    </ServiceInstanceTabsContentWrapper>
  );
};

export default ServiceInstanceTabs;
