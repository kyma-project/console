import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';
import { getServiceClassPlans } from './queries';
import { serviceClassConstants } from '../../variables';

import { Spinner, PageHeader, GenericList } from '../../react-shared';

import { getResourceDisplayName, isService } from '../../commons/helpers';
import { sortByDisplayName } from '../../shared/sorting';
import { Panel } from 'fundamental-react';

const goToDetails = (item, serviceClassId) => {
  if (!serviceClassId) return null;

  return LuigiClient.linkManager()
    .fromClosestContext()
    .navigate(`details/${serviceClassId}/plan/${item.name}`);
};

export default function ServiceClassPlansList({ name }) {
  const namespace = LuigiClient.getEventData().environmentId;
  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  } = useQuery(getServiceClassPlans, {
    variables: {
      namespace,
      name,
    },
    fetchPolicy: 'no-cache',
  });

  if (queryLoading) {
    return <Spinner />;
  }

  if (queryError) {
    return (
      <div className="empty-list">
        {serviceClassConstants.errorServiceClassPlansList}
      </div>
    );
  }

  const headerRenderer = () => [''];

  const rowRenderer = item => [
    <span
      className="link link--bold"
      data-test-id="plan-name"
      onClick={() => goToDetails(item, serviceClass.name)}
    >
      {getResourceDisplayName(item)}
    </span>,
  ];

  const serviceClass = queryData.clusterServiceClass || queryData.serviceClass;

  const breadcrumbItems = [
    {
      name: `${serviceClassConstants.title} - ${
        isService({ labels: serviceClass.labels }) ? 'Services' : 'Add-Ons'
      }`,
      path: '/',
      params: {
        selectedTab: isService({ labels: serviceClass.labels })
          ? 'services'
          : 'addons',
      },
    },
    {
      name: '',
    },
  ];

  if (!serviceClass) {
    return (
      <div className="empty-list"> {serviceClassConstants.noClassText}</div>
    );
  }
  return (
    <article>
      <PageHeader
        title={getResourceDisplayName(serviceClass)}
        breadcrumbItems={breadcrumbItems}
      />
      <GenericList
        title="Choose Service Class Plan"
        entries={serviceClass.plans.sort(sortByDisplayName)}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        showSearchField={false}
        showHeader={false}
      />
    </article>
  );
}
