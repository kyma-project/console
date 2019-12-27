import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';
import { LayoutGrid, Panel, Button } from 'fundamental-react';

import AccessStrategy from '../AccessStrategy/AccessStrategy';
import { GET_API_RULE } from '../../../gql/queries';
import { Spinner, PageHeader, CopiableText } from 'react-shared';
import { useDeleteApiRule } from '../useDeleteApiRule';

const ApiRuleDetails = ({ apiName }) => {
  const { error, loading, data } = useQuery(GET_API_RULE, {
    variables: {
      namespace: LuigiClient.getContext().namespaceId,
      name: apiName,
    },
  });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <h1>Couldn't fetch API rule data</h1>;
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
            <Panel.Body aria-label="Access strategies">
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

function DeleteButton({ apiRuleName }) {
  const [handleAPIRuleDelete] = useDeleteApiRule();
  return (
    <Button
      onClick={() => handleAPIRuleDelete(apiRuleName)}
      option="light"
      type="negative"
      aria-label="delete-api-rule"
    >
      Delete
    </Button>
  );
}

function ApiRuleDetailsHeader({ data }) {
  return (
    <PageHeader
      title={data.name}
      breadcrumbItems={breadcrumbItems}
      actions={<DeleteButton apiRuleName={data.name} />}
    >
      <PageHeader.Column title="Host">
        <CopiableText text={`https://${data.service.host}`} />
      </PageHeader.Column>
      <PageHeader.Column title="Service">
        {`${data.service.name} (port: ${data.service.port})`}
      </PageHeader.Column>
    </PageHeader>
  );
}
