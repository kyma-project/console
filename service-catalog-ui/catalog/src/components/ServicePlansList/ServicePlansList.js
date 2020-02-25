import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';
import { getServiceClassPlans } from './queries';
import { serviceClassConstants } from '../../variables';

import { Spinner, PageHeader, GenericList } from '../../react-shared';

import {
  getResourceDisplayName,
  isService,
  isStringValueEqualToTrue,
} from '../../commons/helpers';

const goToDetails = (item, serviceClassId, documentationPerPlan) => {
  if (!serviceClassId) return null;

  if (!documentationPerPlan) {
    return LuigiClient.linkManager()
      .fromClosestContext()
      .navigate(`details/${serviceClassId}`);
  }

  return LuigiClient.linkManager()
    .fromClosestContext()
    .navigate(`details/${serviceClassId}/plan/${item.name}`);
};

export default function ServicePlansList({ name }) {
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
        {serviceClassConstants.errorServiceClassDetails}
      </div>
    );
  }

  const headerRenderer = () => ['Name'];

  const rowRenderer = item => {
    const documentationPerPlan =
      serviceClass.labels &&
      serviceClass.labels['documentation-per-plan'] &&
      isStringValueEqualToTrue(serviceClass.labels['documentation-per-plan']);
    return [
      <span
        className="link link--bold"
        data-test-id="plan-name"
        onClick={() =>
          goToDetails(item, serviceClass.name, documentationPerPlan)
        }
      >
        {getResourceDisplayName(item)}
      </span>,
    ];
  };

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
        title="Choose Service Class Variant"
        entries={serviceClass.plans}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        showSearchField={false}
      />
    </article>
  );
}
