import { useState, useEffect, useContext } from 'react';
import createContainer from 'constate';
import { ClusterAssetGroup } from '@kyma-project/common';

import { QueriesService } from './queries.service';
import { NavigationService, ActiveNavNode } from './navigation.service';
import { ClusterAssetGroups } from './types';

const newActiveClusterAssetGroup = ({
  clusterAssetGroups,
  activeNavNode,
  activeClusterAssetGroup,
}: {
  clusterAssetGroups?: ClusterAssetGroups;
  activeNavNode: ActiveNavNode;
  activeClusterAssetGroup: ClusterAssetGroup | null;
}): ClusterAssetGroup | undefined => {
  if (!activeNavNode) {
    return;
  }

  const { group, topic } = activeNavNode;
  const newClusterAssetGroup =
    clusterAssetGroups &&
    clusterAssetGroups[group] &&
    clusterAssetGroups[group].find(cag => cag.name === topic);

  if (
    activeClusterAssetGroup &&
    newClusterAssetGroup &&
    activeClusterAssetGroup.name === newClusterAssetGroup.name
  ) {
    return;
  }
  return newClusterAssetGroup;
};

const useClusterAssetGroups = () => {
  const { clusterAssetGroups } = useContext(QueriesService);
  const { activeNavNode } = useContext(NavigationService);
  const [
    activeClusterAssetGroup,
    setActiveClusterAssetGroup,
  ] = useState<ClusterAssetGroup | null>(null);

  useEffect(() => {
    const newClusterAssetGroup = newActiveClusterAssetGroup({
      clusterAssetGroups,
      activeNavNode,
      activeClusterAssetGroup,
    });
    newClusterAssetGroup && setActiveClusterAssetGroup(newClusterAssetGroup);
  }, [clusterAssetGroups, activeNavNode, activeClusterAssetGroup]);

  return {
    activeClusterAssetGroup,
  };
};

const { Provider, Context } = createContainer(
  useClusterAssetGroups,
  context => [context.activeClusterAssetGroup],
);
export {
  Provider as ClusterAssetGroupsProvider,
  Context as ClusterAssetGroupsService,
};
