import React from 'react';
import { getComponentForList } from 'shared/getComponents';

export const ServicesDetails = DefaultRenderer => ({ ...otherParams }) => {
  const ApiRuleList = getComponentForList({
    name: 'apiruleList',
    params: {
      hasDetailsView: false,
      resourceUrl: `/apis/gateway.kyma-project.io/v1alpha1/namespaces/${otherParams.namespace}/apirules`,
      resourceType: 'apirules',
      namespace: otherParams.namespace,
      isCompact: true,
      showTitle: true,
      filter: apirule => apirule.spec.service.name === otherParams.resourceName,
    },
  });
  return <DefaultRenderer {...otherParams}>{ApiRuleList}</DefaultRenderer>;
};
