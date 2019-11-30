import { ClusterAssetGroup } from '@kyma-project/common';

export interface ClusterAssetGroups {
  [group: string]: ClusterAssetGroup[];
}

export interface Navigation {
  [group: string]: NavigationItem[];
}

export interface NavigationItem {
  name: string;
  group: string;
  displayName: string;
}
