import React from 'react';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';

import { GenericList, useNotification, easyHandleDelete } from 'react-shared';
import { Button } from 'fundamental-react';
import ApiRuleStatus from './ApiRuleStatus';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_API_RULES_FOR_SERVICE } from 'gql/queries';
import { DELETE_API_RULE } from 'gql/mutations';

ServiceApiRules.propTypes = {
  namespaceId: PropTypes.string.isRequired,
  service: PropTypes.object.isRequired,
};

function navigateToAPIRuleEdit(apiRule) {
  LuigiClient.linkManager()
    .fromContext('namespaces')
    .navigate(`cmf-apirules/edit/${apiRule.name}`);
}

function navigateToAPIRuleDetails(apiRule) {
  LuigiClient.linkManager()
    .fromContext('namespaces')
    .navigate(`cmf-apirules/details/${apiRule.name}`);
}

function navigateToCreate(service) {
  LuigiClient.linkManager()
    .fromContext('namespaces')
    .withParams({
      serviceName: service.name,
      port: service.json.spec.ports[0].port,
    })
    .navigate('cmf-apirules/create');
}

export default function ServiceApiRules({ namespaceId, service }) {
  const [deleteApiRule] = useMutation(DELETE_API_RULE, {
    refetchQueries: () => [
      {
        query: GET_API_RULES_FOR_SERVICE,
        variables: { namespace: namespaceId },
      },
    ],
  });
  const notification = useNotification();

  const { data, loading, error } = useQuery(GET_API_RULES_FOR_SERVICE, {
    variables: { namespace: namespaceId },
    fetchPolicy: 'no-cache',
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  // TODO use query with service param when https://github.com/kyma-project/kyma/pull/8878 is merged
  const apiRules = data.APIRules.filter(aR => aR.service.name === service.name);

  const extraHeaderContent = (
    <Button glyph="add" onClick={() => navigateToCreate(service)}>
      Expose API
    </Button>
  );

  const actions = [
    {
      name: 'Delete',
      handler: entry =>
        easyHandleDelete(
          'API Rule',
          entry.name,
          deleteApiRule,
          {
            variables: {
              name: entry.name,
              namespace: namespaceId,
            },
          },
          'deleteAPIRule',
          notification,
        ),
    },
    {
      name: 'Edit',
      handler: navigateToAPIRuleEdit,
    },
  ];

  const headerRenderer = () => ['Name', 'Host', 'Port', 'Status'];

  const rowRenderer = apiRule => [
    <span className="link" onClick={() => navigateToAPIRuleDetails(apiRule)}>
      {apiRule.name}
    </span>,
    apiRule.service.host,
    apiRule.service.port,
    <ApiRuleStatus {...apiRule.status.apiRuleStatus} />,
  ];

  return (
    <GenericList
      extraHeaderContent={extraHeaderContent}
      title={`API Rules for ${service.name}`}
      notFoundMessage="No API Rules defined"
      actions={actions}
      entries={apiRules}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      textSearchProperties={['name', 'host', 'port']}
    />
  );
}
