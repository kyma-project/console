import React from 'react';
import LuigiClient from '@luigi-project/client';

import { GenericList, Labels } from 'react-shared';
import { Link } from 'fundamental-react';
import { LambdaStatusBadge } from '../LambdaStatusBadge/LambdaStatusBadge';

import { useDeleteLambda } from 'components/Lambdas/gql/hooks/mutations';

import { prettyRuntime } from 'components/Lambdas/helpers/runtime';
import {
  LAMBDAS_LIST,
  ERRORS,
  REFETCH_LAMBDAS_TIMEOUT,
} from 'components/Lambdas/constants';

const headerRenderer = () => ['Name', 'Runtime', 'Labels', 'Status'];
const textSearchProperties = ['name', 'prettyRuntime', 'status.phase'];

export default function LambdasList({
  lambdas,
  serverDataError,
  serverDataLoading,
  refetchLambdas,
}) {
  const deleteLambda = useDeleteLambda({
    redirect: false,
    onSuccessCallback: () => {
      setTimeout(() => {
        refetchLambdas();
      }, REFETCH_LAMBDAS_TIMEOUT);
    },
  });

  const actions = [
    {
      name: 'Delete',
      handler: lambda => {
        deleteLambda(lambda);
      },
    },
  ];
  const rowRenderer = lambda => [
    <Link
      className="link"
      data-test-id="lambda-name"
      onClick={() =>
        LuigiClient.linkManager().navigate(`details/${lambda.name}`)
      }
    >
      {lambda.name}
    </Link>,
    <span>{prettyRuntime(lambda.runtime)}</span>,
    <Labels labels={lambda.labels} />,
    <LambdaStatusBadge status={lambda.status} />,
  ];

  return (
    <GenericList
      actions={actions}
      entries={lambdas.map(lambda => ({
        ...lambda,
        prettyRuntime: prettyRuntime(lambda.runtime),
      }))}
      showSearchField={true}
      showSearchSuggestion={false}
      textSearchProperties={textSearchProperties}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      serverDataError={serverDataError}
      serverDataLoading={serverDataLoading}
      notFoundMessage={LAMBDAS_LIST.ERRORS.RESOURCES_NOT_FOUND}
      noSearchResultMessage={LAMBDAS_LIST.ERRORS.NOT_MATCHING_SEARCH_QUERY}
      serverErrorMessage={ERRORS.SERVER}
    />
  );
}
