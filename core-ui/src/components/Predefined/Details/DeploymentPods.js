import React from 'react';
import { getComponentForList } from 'shared/getComponents';
import { useGetList } from 'react-shared';

export function DeploymentPods({ namespace, deploymentName }) {
  const [ownerReplicaName, setOwnerReplicaName] = React.useState();

  const replicasUrl = `/apis/apps/v1/namespaces/${namespace}/replicasets`;
  const { data: replicas } = useGetList(() => true)(replicasUrl, {
    pollingInterval: 3000,
  });

  React.useEffect(() => {
    const ownerReplica = replicas?.find(
      rs =>
        !!rs.metadata.ownerReferences.find(
          ref => ref.kind === 'Deployment' && ref.name === deploymentName,
        ),
    );
    setOwnerReplicaName(ownerReplica?.metadata.name);
  }, [replicas]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ownerReplicaName) {
    return 'Loading...';
  }

  // we can't use ?labelSelector=app%3D${otherParams.resourceName}, as some
  // pods (like function ones) don't have this label
  const podListParams = {
    hasDetailsView: false,
    resourceUrl: `/api/v1/namespaces/${namespace}/pods`,
    resourceType: 'pods',
    namespace,
    isCompact: true,
    showTitle: true,
    filter: e => {
      return e.metadata.ownerReferences.find(
        ref => ref.kind === 'ReplicaSet' && ref.name === ownerReplicaName,
      );
    },
  };

  return getComponentForList({ name: 'podsList', params: podListParams });
}
