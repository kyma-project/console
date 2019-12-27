import React from 'react';
import { PageHeader, GenericList, Spinner } from 'react-shared';
import { useQuery } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';
import { Button } from 'fundamental-react';

import { GET_API_RULES } from 'gql/queries';
import { useDeleteApiRule } from './useDeleteApiRule';

export default function ApiRules() {
  const namespace = LuigiClient.getContext().namespaceId;

  const [handleAPIRuleDelete] = useDeleteApiRule();

  const { loading, error, data } = useQuery(GET_API_RULES, {
    variables: { namespace },
  });

  if (error) {
    return `Error! ${error.message}`;
  }

  if (loading) {
    return <Spinner />;
  }

  const headerRenderer = () => ['Name'];

  const rowRenderer = rule => [
    <span
      className="link"
      onClick={() =>
        LuigiClient.linkManager()
          .fromClosestContext()
          .navigate(`/details/${rule.name}`)
      }
    >
      {rule.name}
    </span>,
  ];

  const actions = [
    {
      name: 'Edit',
      handler: entry => {
        console.log('edit', entry);
      },
    },
    {
      name: 'Delete',
      handler: entry => {
        handleAPIRuleDelete(entry.name);
      },
    },
  ];

  return (
    <>
      <PageHeader title="API rules" />
      <GenericList
        actions={actions}
        entries={data.APIRules}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        extraHeaderContent={
          <Button
            glyph="add"
            option="light"
            onClick={() =>
              LuigiClient.linkManager()
                .fromClosestContext()
                .navigate(`/create`)
            }
          >
            Add new API rule
          </Button>
        }
      />
    </>
  );
}
