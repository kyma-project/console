import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import LuigiClient from '@luigi-project/client';
import { LayoutGrid, Panel, Button } from 'fundamental-react';

import AccessStrategy from '../AccessStrategy/AccessStrategy';
import { GET_API_RULE } from '../../../gql/queries';
import { Spinner, PageHeader, CopiableLink } from 'react-shared';
import { useDeleteApiRule } from '../useDeleteApiRule';
import EntryNotFound from 'components/EntryNotFound/EntryNotFound';
import { getApiUrl } from '@kyma-project/common';

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
    console.warn(error);
    return <EntryNotFound entryType="API Rule" entryId={apiName} />;
  }

  const { name, spec } = data.APIRule;
  return (
    <>
      <ApiRuleDetailsHeader service={spec.service} name={name} />
      <section className="fd-section api-rule-container">
        <LayoutGrid cols={1}>
          <Panel>
            <Panel.Header>
              <Panel.Head title="Access strategies" />
            </Panel.Header>
            <Panel.Body aria-label="Access strategies">
              {spec.rules.map((rule, idx) => {
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

function ApiRuleDetailsHeader({ name, service }) {
  const host = `https://${service.host}`;
  const DOMAIN = getApiUrl('domain');
  const url = host.split(`.${DOMAIN}`)[0] + `.${DOMAIN}`;

  const navigateToService = () =>
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(`services/details/${service.name}`);

  return (
    <PageHeader
      title={name}
      breadcrumbItems={breadcrumbItems}
      actions={
        <>
          <DeleteButton apiRuleName={name} />
          <EditButton apiRuleName={name} />
        </>
      }
    >
      <PageHeader.Column title="Service">
        <span className="link" onClick={navigateToService}>
          {`${service.name} (port: ${service.port})`}
        </span>
      </PageHeader.Column>
      <PageHeader.Column title="Host" columnSpan="2 / 4">
        <CopiableLink url={url} />
      </PageHeader.Column>
    </PageHeader>
  );
}
