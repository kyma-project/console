import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import { Badge } from 'fundamental-react';
import { GenericList, Labels, Tooltip } from 'react-shared';

import { useDeleteLambda } from 'components/Lambdas/gql/hooks/mutations';

import { statusType } from 'components/Lambdas/helpers/lambdas';
import { formatMessage } from 'components/Lambdas/helpers/misc';
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

  const badgeComponent = <Badge type={badgeType}>{texts.TITLE}</Badge>;

  if (!LAMBDA_ERROR_PHASES.includes(statusPhase)) {
    return badgeComponent;
  }

  const formattedError = formatMessage(LAMBDA_PHASES.ERROR_SUFFIX, {
    error: status.message,
  });
  const tooltipTitle = `${texts.MESSAGE} ${formattedError}`;

  return (
    <Tooltip
      title={tooltipTitle}
      position="top"
      trigger="mouseenter"
      tippyProps={{
        distance: 8,
      }}
    >
      {badgeComponent}
    </Tooltip>
  );
}

const headerRenderer = () => ['Name', 'Labels', 'Status'];
const textSearchProperties = ['name', 'status.phase'];

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
    <span
      className="link"
      data-test-id="lambda-name"
      onClick={() =>
        LuigiClient.linkManager().navigate(`details/${lambda.name}`)
      }
    >
      {lambda.name}
    </span>,
    <Labels labels={lambda.labels} />,
    <LambdaStatusBadge status={lambda.status} />,
  ];

  return (
    <GenericList
      actions={actions}
      entries={lambdas}
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
