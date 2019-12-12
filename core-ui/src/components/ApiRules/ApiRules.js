import React from 'react';
import { PageHeader, GenericList, Spinner } from 'react-shared';
import { GET_API_RULES } from 'gql/queries';
import { useQuery } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';
import { Button } from 'fundamental-react';

const ApiRules = () => {
  const headerRenderer = () => ['Name'];

  const rowRenderer = rule => [
    <span
      className="link"
      onClick={() => LuigiClient.linkManager().navigate(`details/${rule.name}`)}
    >
      {rule.name}
    </span>,
  ];

  const { loading, error, data } = useQuery(GET_API_RULES, {
    variables: { namespace: LuigiClient.getContext().namespaceId },
  });

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
        console.log('delete', entry);
      },
    },
  ];

  if (error) {
    return `Error! ${error.message}`;
  }

  if (loading) {
    return <Spinner />;
  }

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
            onClick={() => LuigiClient.linkManager().navigate(`create`)}
          >
            Add new API rule
          </Button>
        }
      />
    </>
  );
};

export default ApiRules;
