import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import { PageHeader } from 'react-shared';

import { useLambdasQuery } from 'components/Lambdas/gql/hooks/queries';

import CreateLambdaModal from './CreateLambdaModal';
import LambdasList from './LambdasList';

import { TOOLBAR } from 'components/Lambdas/constants';

import './LambdasList.scss';

export default function LambdaDetailsWrapper() {
  const { lambdas, error, loading, loadedData, refetch } = useLambdasQuery({
    namespace: LuigiClient.getEventData().environmentId,
  });

  const headerActions = (
    <CreateLambdaModal
      serverDataError={error || false}
      serverDataLoading={loading || false}
    />
  );

  return (
    <div className="lambdas-list">
      <PageHeader
        title={TOOLBAR.TITLE}
        description={TOOLBAR.DESCRIPTION}
        actions={headerActions}
        testid="title"
      />
      <LambdasList
        lambdas={lambdas}
        serverDataError={error || false}
        serverDataLoading={loading || !loadedData || false}
        refetchLambdas={refetch}
      />
    </div>
  );
}
