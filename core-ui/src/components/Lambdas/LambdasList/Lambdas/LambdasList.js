import React from 'react';
import LuigiClient from '@luigi-project/client';

import { GenericList, Labels } from 'react-shared';
import { Link } from 'fundamental-react';
import { LambdaStatusBadge } from 'components/Lambdas/LambdaStatusBadge/LambdaStatusBadge';

import CreateLambdaModal from './CreateLambdaModal';
import { useDeleteLambda } from 'components/Lambdas/gql/hooks/mutations';

import { prettySourceType } from 'components/Lambdas/helpers/lambdas';
import { prettyRuntime } from 'components/Lambdas/helpers/runtime';
import {
  SERVERLESS_PRESETS_LABELS,
  LAMBDAS_LIST,
  ERRORS,
  REFETCH_LAMBDAS_TIMEOUT,
} from 'components/Lambdas/constants';

const headerRenderer = () => [
  'Name',
  'Source Type',
  'Runtime',
  'Labels',
  'Status',
];
const textSearchProperties = [
  'name',
  'prettySourceType',
  'prettyRuntime',
  'labels',
  'status.phase',
];

export default function LambdasList({
  lambdas = [],
  repositories,
  serverDataError = false,
  serverDataLoading = false,
  refetchLambdas,
}) {
  const functionNames = lambdas.map(l => l.name);
  const headerActions = (
    <CreateLambdaModal
      functionNames={functionNames}
      repositories={repositories}
      serverDataError={serverDataError || false}
      serverDataLoading={serverDataLoading || false}
    />
  );

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
    <span>{prettySourceType(lambda.sourceType)}</span>,
    <span>{prettyRuntime(lambda.runtime)}</span>,
    <Labels labels={lambda.labels} ignoreLabels={SERVERLESS_PRESETS_LABELS} />,
    <LambdaStatusBadge status={lambda.status} />,
  ];

  return (
    <GenericList
      actions={actions}
      entries={lambdas.map(lambda => ({
        ...lambda,
        prettyRuntime: prettyRuntime(lambda.runtime),
        prettySourceType: prettySourceType(lambda.sourceType),
      }))}
      showSearchField={true}
      showSearchSuggestion={false}
      textSearchProperties={textSearchProperties}
      extraHeaderContent={headerActions}
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
