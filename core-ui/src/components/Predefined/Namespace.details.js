import React from 'react';
import { getComponentForList } from './../App/App';

export const NamespacesDetails = DefaultRenderer => ({ ...otherParams }) => {
  const params = {
    hasDetailsView: false,
    resourceUrl: `/api/v1/namespaces/${otherParams.resourceName}/limitranges`,
    resourceType: 'limitranges',
    namespace: otherParams.resourceName,
    isCompact: true,
  };

  const LimitrangesList = getComponentForList('limitrangesList', params);

  return (
    <DefaultRenderer customComponents={[LimitrangesList]} {...otherParams} />
  );
};
