import React from 'react';

import { Button, InlineHelp } from 'fundamental-react';
import { PageHeader } from 'react-shared';

import { useDeleteLambda } from 'components/Lambdas/gql/hooks/mutations';

import LambdaLabels from './LambdaLabels';
import { LambdaStatusBadge } from 'components/Lambdas/LambdaStatusBadge/LambdaStatusBadge';

import {
  BUTTONS,
  FIRST_BREADCRUMB_NODE,
  LAMBDA_DETAILS,
} from 'components/Lambdas/constants';

import './LambdaDetailsHeader.scss';
import {
  prettySourceType,
  isGitSourceType,
} from 'components/Lambdas/helpers/lambdas';
import { prettyRuntime } from 'components/Lambdas/helpers/runtime';

const breadcrumbItems = [
  {
    name: FIRST_BREADCRUMB_NODE,
    path: '/',
  },
  {
    name: '',
  },
];

export default function LambdaDetailsHeader({ lambda }) {
  const deleteLambda = useDeleteLambda({
    redirect: true,
  });

  const actions = (
    <Button onClick={() => deleteLambda(lambda)} option="light" type="negative">
      {BUTTONS.DELETE}
    </Button>
  );

  return (
    <div className="lambda-details-header">
      <PageHeader
        title={lambda.name}
        breadcrumbItems={breadcrumbItems}
        actions={actions}
      >
        <PageHeader.Column title="Status">
          <LambdaStatusBadge status={lambda.status} />
        </PageHeader.Column>
        <PageHeader.Column title={LAMBDA_DETAILS.SOURCE_TYPE.TEXT}>
          {prettySourceType(lambda.sourceType)}
        </PageHeader.Column>
        <PageHeader.Column title={LAMBDA_DETAILS.RUNTIME.TEXT}>
          {prettyRuntime(lambda.runtime)}
          {lambda.runtime === 'nodejs10' && (
            <InlineHelp
              placement="bottom-right"
              text="Use kubectl to upgrade Function's runtime to Node.js 12 or newer to reconcile the Function"
            />
          )}
        </PageHeader.Column>
        {isGitSourceType(lambda.sourceType) && (
          <PageHeader.Column title={LAMBDA_DETAILS.REPOSITORY.TEXT}>
            {lambda.source}
          </PageHeader.Column>
        )}
      </PageHeader>
      <div className="fd-panel-grid fd-panel-grid--2col lambda-details-header__content">
        <div className="fd-has-grid-column-span-1">
          <LambdaLabels lambda={lambda} />
        </div>
      </div>
    </div>
  );
}
