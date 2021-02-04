import React from 'react';
import { getComponentForList } from './../App/App';
export const ReplicasetsDetails = DefaultRenderer => ({ ...otherParams }) => {
  const customColumns = [
    {
      header: 'Limits',
      value: resource => {
        const containers = resource.spec.template.spec.containers || [];
        return (
          <>
            {containers.map(c => (
              <>
                CPU: {c.resources?.limits?.cpu}
                <br />
                Memory: {c.resources?.limits?.memory}
                <br />
              </>
            ))}
          </>
        );
      },
    },
    {
      header: 'Requests',
      value: resource => {
        const containers = resource.spec.template.spec.containers || [];
        return (
          <>
            {containers.map(c => (
              <>
                CPU: {c.resources?.requests?.cpu}
                <br />
                Memory: {c.resources?.requests?.memory}
                <br />
              </>
            ))}
          </>
        );
      },
    },
  ];

  const PodsList = getComponentForList('podsList', {
    hasDetailsView: false,
    resourceUrl: `/api/v1/namespaces/${otherParams.namespace}/pods`,
    resourceType: 'pods',
    namespace: otherParams.namespace,
    isCompact: true,
    showTitle: true,
  });

  const ServiceList = getComponentForList('ServicesList', {
    hasDetailsView: false,
    resourceUrl: `/api/v1/namespaces/default/services`,
    resourceType: 'services',
    namespace: 'default',
    isCompact: true,
    showTitle: true,
  });

  return (
    <DefaultRenderer
      customComponents={[ServiceList, PodsList]}
      customColumns={customColumns}
      {...otherParams}
    />
  );
};
