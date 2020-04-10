import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';
import { LayoutGrid, Panel, Button, Icon } from 'fundamental-react';

import AccessStrategy from '../AccessStrategy/AccessStrategy';
import { GET_API_RULE } from '../../../gql/queries';
import { Spinner, PageHeader, CopiableText } from 'react-shared';
import { useDeleteApiRule } from '../useDeleteApiRule';
import EntryNotFound from 'components/EntryNotFound/EntryNotFound';

const ApiRuleDetails = ({ apiName }) => {
  const { error, loading, data } = useQuery(GET_API_RULE, {
    variables: {
      namespace: LuigiClient.getContext().namespaceId,
      name: apiName,
    },
    fetchPolicy: 'no-cache',
  });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <h1>Couldn't fetch API rule data</h1>;
  }

  if (!data.APIRule) {
    return <EntryNotFound entryType="API Rule" entryId={apiName} />;
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
              {data.APIRule.rules.map((rule, idx) => {
                return <AccessStrategy strategy={rule} key={idx} />;
              })}
            </Panel.Body>
          </Panel>
        </LayoutGrid>
      </section>
    </>
  );
};

ApiRuleDetails.propTypes = {
  apiName: PropTypes.string.isRequired,
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

function EditButton({ apiRuleName }) {
  return (
    <Button
      onClick={() => navigateToEditView(apiRuleName)}
      option="light"
      aria-label="edit-api-rule"
    >
      Edit
    </Button>
  );
}

function navigateToEditView(apiRuleName) {
  LuigiClient.linkManager()
    .fromClosestContext()
    .navigate(`/edit/${apiRuleName}`);
}

function ApiRuleDetailsHeader({ data }) {
  const host = `https://${data.service.host}`;
  const hostCaption = (
    <a href={host} target="_blank" rel="noopener noreferrer">
      {host}
      <Icon glyph="inspect" size="s" className="fd-has-margin-left-tiny" />
    </a>
  );

  const navigateToService = () =>
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(`services/details/${data.service.name}`);

  return (
    <PageHeader
      title={data.name}
      breadcrumbItems={breadcrumbItems}
      actions={
        <>
          <DeleteButton apiRuleName={data.name} />
          <EditButton apiRuleName={data.name} />
        </>
      }
    >
      <PageHeader.Column title="Service">
        <span className="link" onClick={navigateToService}>
          {`${data.service.name} (port: ${data.service.port})`}
        </span>
      </PageHeader.Column>
      <PageHeader.Column title="Host" columnSpan="2 / 4">
        <CopiableText textToCopy={host} caption={hostCaption} />
      </PageHeader.Column>
    </PageHeader>
  );
}
