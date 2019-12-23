import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';
import { LayoutGrid, Panel } from 'fundamental-react';

import AccessStrategy from '../AccessStrategy/AccessStrategy';
import { GET_API_RULE } from '../../../gql/queries';
import { Spinner, PageHeader, CopiableText } from 'react-shared';

const ApiRuleDetails = ({ apiName }) => {
  const { error, loading, data } = useQuery(GET_API_RULE, {
    variables: {
      namespace: LuigiClient.getEventData().environmentId,
      name: apiName,
    },
  });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <ApiRuleDetailsHeader data={data.APIRule} />
      <section className="fd-section api-rule-container">
        <LayoutGrid cols={1}>
          <Panel>
            <Panel.Header>
              <Panel.Head title="Access strategies" />
            </Panel.Header>
            <Panel.Body>
              {data.APIRule.rules.map(rule => {
                return (
                  <AccessStrategy
                    key={rule.path + rule.accessStrategies[0].name}
                    strategy={rule}
                  />
                );
              })}
            </Panel.Body>
          </Panel>
        </LayoutGrid>
      </section>
    </>
  );
};

export default ApiRuleDetails;

const breadcrumbItems = [{ name: 'API Rules', path: '/' }, { name: '' }];

const ApiRuleDetailsHeader = ({ data }) => {
  return (
    <PageHeader title={data.name} breadcrumbItems={breadcrumbItems}>
      <PageHeader.Column key="host" title="Host">
        <CopiableText text={`https://${data.service.host}`} />
      </PageHeader.Column>
      <PageHeader.Column key="service" title="Service">
        {`${data.service.name} (port: ${data.service.port})`}
      </PageHeader.Column>
    </PageHeader>
  );
};
