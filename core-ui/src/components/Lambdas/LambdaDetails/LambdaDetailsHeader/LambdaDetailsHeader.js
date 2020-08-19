import React from 'react';

import { Button } from 'fundamental-react';
import { PageHeader } from 'react-shared';

import { useDeleteLambda } from 'components/Lambdas/gql/hooks/mutations';

import LambdaLabels from './LambdaLabels';
import LambdaStatusCard from './LambdaStatusCard';

import { BUTTONS, FIRST_BREADCRUMB_NODE } from 'components/Lambdas/constants';

import './LambdaDetailsHeader.scss';
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
          <div className="fd-has-margin-bottom-l">
            <span className="fd-has-color-text-4 ">{'Runtime: '}</span>
            <span>{prettyRuntime(lambda.runtime)}</span>
          </div>
        </div>
        <div className="fd-has-grid-column-span-1">
          <LambdaStatusCard lambdaName={lambda.name} status={lambda.status} />
        </div>
      </div>
    </div>
  );
}
