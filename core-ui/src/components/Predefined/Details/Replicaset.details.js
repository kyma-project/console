import React from 'react';
import { getComponentForList } from 'shared/getComponents';

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

  const PodsList = getComponentForList({
    name: 'podsList',
    params: {
      hasDetailsView: false,
      resourceUrl: `/api/v1/namespaces/${otherParams.namespace}/pods`,
      resourceType: 'pods',
      namespace: otherParams.namespace,
      isCompact: true,
      showTitle: true,
      filter: pod =>
        !!pod.metadata.ownerReferences.find(
          ref =>
            ref.kind === 'ReplicaSet' && ref.name === otherParams.resourceName,
        ),
    },
  });

  return (
    <DefaultRenderer customColumns={customColumns} {...otherParams}>
      {PodsList}
    </DefaultRenderer>
  );
};
