import React from 'react';
import LuigiClient from '@luigi-project/client';

import { GenericList, Labels, StatusBadge } from 'react-shared';
import { Link } from 'fundamental-react';

import CreateLambdaModal from './CreateLambdaModal';
import { useDeleteLambda } from 'components/Lambdas/gql/hooks/mutations';

import {
  statusType,
  prettySourceType,
} from 'components/Lambdas/helpers/lambdas';
import { formatMessage } from 'components/Lambdas/helpers/misc';
import { prettyRuntime } from 'components/Lambdas/helpers/runtime';
import {
  LAMBDAS_LIST,
  LAMBDA_PHASES,
  LAMBDA_ERROR_PHASES,
  ERRORS,
  REFETCH_LAMBDAS_TIMEOUT,
} from 'components/Lambdas/constants';

function LambdaStatusBadge({ status }) {
  const statusPhase = status.phase;

  const texts = LAMBDA_PHASES[statusPhase];
  let badgeType = statusType(statusPhase);
  if (badgeType === 'info') {
    badgeType = undefined;
  }

  let tooltipText;

  if (LAMBDA_ERROR_PHASES.includes(statusPhase)) {
    const formattedError = formatMessage(LAMBDA_PHASES.ERROR_SUFFIX, {
      error: status.message,
    });
    tooltipText = `${texts.MESSAGE} ${formattedError}`;
  }

  return (
    <StatusBadge tooltipContent={tooltipText} type={badgeType}>
      {texts.TITLE}
    </StatusBadge>
  );
}

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
    <Labels labels={lambda.labels} />,
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
