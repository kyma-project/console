import React from 'react';
import { getComponentForList } from 'shared/getComponents';
import DeployNewWorkload from './DeployNewWorkload';

export const NamespacesDetails = DefaultRenderer => ({ ...otherParams }) => {
  const limitRangesParams = {
    hasDetailsView: false,
    resourceUrl: `/api/v1/namespaces/${otherParams.resourceName}/limitranges`,
    resourceType: 'limitranges',
    namespace: otherParams.resourceName,
    isCompact: true,
    showTitle: true,
  };

  const LimitrangesList = getComponentForList({
    name: 'limitrangesList',
    params: limitRangesParams,
  });

  const resourceQuotasParams = {
    hasDetailsView: false,
    resourceUrl: `/api/v1/namespaces/${otherParams.resourceName}/resourcequotas`,
    resourceType: 'resourcequotas',
    namespace: otherParams.resourceName,
    isCompact: true,
    showTitle: true,
  };

  const ResourceQuotasList = getComponentForList({
    name: 'resourcequotaslist',
    params: resourceQuotasParams,
  });

  const headerActions = (
    <DeployNewWorkload namespaceName={otherParams.resourceName} />
  );
  return (
    <DefaultRenderer {...otherParams} headerActions={headerActions}>
      {LimitrangesList}
      {ResourceQuotasList}
    </DefaultRenderer>
  );
};
