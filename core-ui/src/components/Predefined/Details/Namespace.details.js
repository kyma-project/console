import React from 'react';
import { getComponentForList } from 'shared/getComponents';

export const NamespacesDetails = DefaultRenderer => ({ ...otherParams }) => {
  const limitRangesParams = {
    hasDetailsView: false,
    resourceUrl: `/api/v1/namespaces/${otherParams.resourceName}/limitranges`,
    resourceType: 'limitranges',
    namespace: otherParams.resourceName,
    isCompact: true,
    showTitle: true,
  };

  const LimitrangesList = getComponentForList(
    'limitrangesList',
    limitRangesParams,
  );

  const resourceQuotasParams = {
    hasDetailsView: false,
    resourceUrl: `/api/v1/namespaces/${otherParams.resourceName}/resourcequotas`,
    resourceType: 'resourcequotas',
    namespace: otherParams.resourceName,
    isCompact: true,
    showTitle: true,
  };

  const ResourceQuotasList = getComponentForList(
    'resourcequotaslist',
    resourceQuotasParams,
  );

  return (
    <DefaultRenderer {...otherParams}>
      {LimitrangesList}
      {ResourceQuotasList}
    </DefaultRenderer>
  );
};
