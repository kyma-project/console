import React from 'react';
import LuigiClient from '@luigi-project/client';
import { TabGroup, Tab } from 'fundamental-react';

import { PageHeader } from 'react-shared';

import { useLambdasQuery } from 'components/Lambdas/gql/hooks/queries';

import LambdasList from './Lambdas/LambdasList';
import RepositoriesList from './Repositories/RepositoriesList';

import {
  TOOLBAR,
  LAMBDAS_LIST,
  REPOSITORIES_LIST,
} from 'components/Lambdas/constants';

import './Wrapper.scss';

export default function Wrapper() {
  const {
    lambdas,
    repositories,
    error,
    loading,
    loadedData,
    refetch,
  } = useLambdasQuery({
    namespace: LuigiClient.getEventData().environmentId,
  });

  return (
    <div className="serverless-resources-wrapper">
      <PageHeader title={TOOLBAR.TITLE} description={TOOLBAR.DESCRIPTION} />
      <TabGroup className="serverless-resources">
        <Tab key="functions" id="functions" title={LAMBDAS_LIST.TAB_TITLE}>
          <LambdasList
            lambdas={lambdas}
            repositories={repositories}
            serverDataError={error || false}
            serverDataLoading={loading || !loadedData || false}
            refetchLambdas={refetch}
          />
        </Tab>
        <Tab
          key="repositories"
          id="repositories"
          title={REPOSITORIES_LIST.TAB_TITLE}
        >
          <RepositoriesList
            repositories={repositories}
            serverDataError={error || false}
            serverDataLoading={loading || !loadedData || false}
            refetchRepositories={refetch}
          />
        </Tab>
      </TabGroup>
    </div>
  );
}
