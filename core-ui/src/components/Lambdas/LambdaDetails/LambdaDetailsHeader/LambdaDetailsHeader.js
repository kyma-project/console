import React from 'react';

import { Button } from 'fundamental-react';
import { PageHeader } from 'react-shared';

import { useDeleteLambda } from 'components/Lambdas/gql/hooks/mutations';

import LambdaLabels from './LambdaLabels';
import LambdaStatusCard from './LambdaStatusCard';

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
      />
      <div className="fd-panel-grid fd-panel-grid--3col lambda-details-header__content">
        <div className="fd-has-grid-column-span-2">
          <LambdaLabels lambda={lambda} />
          <div className="fd-panel-grid fd-panel-grid--3col">
            <PageHeader.Column title={LAMBDA_DETAILS.SOURCE_TYPE.TEXT}>
              <span>{prettySourceType(lambda.sourceType)}</span>
            </PageHeader.Column>
            <PageHeader.Column
              title={LAMBDA_DETAILS.RUNTIME.TEXT}
              columnSpan="2 / 3"
            >
              <span>{prettyRuntime(lambda.runtime)}</span>
            </PageHeader.Column>
            {isGitSourceType(lambda.sourceType) && (
              <PageHeader.Column
                title={LAMBDA_DETAILS.REPOSITORY.TEXT}
                columnSpan="3 / 3"
              >
                <span>{lambda.source}</span>
              </PageHeader.Column>
            )}
          </div>
        </div>
        <div className="fd-has-grid-column-span-1">
          <LambdaStatusCard lambdaName={lambda.name} status={lambda.status} />
        </div>
      </div>
    </div>
  );
}
