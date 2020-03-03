import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';
import { getServiceClassPlans } from './queries';
import { serviceClassConstants } from '../../variables';

import { Spinner, PageHeader, GenericList } from '../../react-shared';

import { getResourceDisplayName, isService } from '../../commons/helpers';
import { sortByDisplayName } from '../../shared/sorting';
import { Badge, Identifier } from 'fundamental-react';

const DOC_TYPES_COLORS = new Map([
  ['openapi', ''],
  ['asyncapi', 'success'],
  ['odata', 'warning'],
]);

const goToDetails = (item, serviceClassId) => {
  if (!serviceClassId) return null;

  return LuigiClient.linkManager()
    .fromClosestContext()
    .navigate(`details/${serviceClassId}/plan/${item.name}`);
};

function getPlanDocTypes(plan) {
  const typesMap = new Map();
  let assetKey = 'assetGroup';

  if (plan.clusterAssetGroup) assetKey = 'clusterAssetGroup';

  plan[assetKey].assets.forEach(({ type }) =>
    typesMap.set(type, (typesMap.has(type) ? typesMap.has(type) : 0) + 1),
  );
  return typesMap;
}

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

  const headerRenderer = () => ['', ''];

  const rowRenderer = item => [
    <span
      className="link link--bold"
      data-test-id="plan-name"
      onClick={() => goToDetails(item, serviceClass.name)}
    >
      {getResourceDisplayName(item)}
    </span>,
    <>
      {Array.from(getPlanDocTypes(item).entries()).map(([type, count]) => (
        <p key={type}>
          {count > 1 && <Identifier size="xxs">{count}</Identifier>}
          <Badge type={DOC_TYPES_COLORS.get(type)}>{type}</Badge>
        </p>
      ))}
    </>,
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