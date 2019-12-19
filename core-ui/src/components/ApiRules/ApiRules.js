import React from 'react';
import { PageHeader, GenericList, Spinner } from 'react-shared';
import { GET_API_RULES } from 'gql/queries';
import { useQuery } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';

const ApiRules = () => {
  const headerRenderer = () => ['Name'];

  const rowRenderer = rule => [rule.name];

  const { loading, error, data } = useQuery(GET_API_RULES, {
    variables: { namespace: LuigiClient.getContext().namespaceId },
  });

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
        //actions={actions}
        entries={data.APIRules}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        // extraHeaderContent={<CreateLambdaModal />}
      />
    </>
  );
};

export default ApiRules;
