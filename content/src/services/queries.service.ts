import gql from 'graphql-tag';
import createContainer from 'constate';
import { useQuery } from '@apollo/react-hooks';
import { ClusterAssetGroup } from '@kyma-project/common';

import { ClusterAssetGroups } from './types';
import { FILTER_EXTENSIONS, VIEW_CONTEXT, ROOT_GROUP } from '../constants';

const extractGroups = (clusterAssetGroups: ClusterAssetGroup[]): string[] => {
  const groupNames: Set<string> = new Set<string>();
  clusterAssetGroups.forEach(cdt => groupNames.add(cdt.groupName));
  return Array.from(groupNames).sort((a, b) => {
    const nameA = a.toString().toLowerCase();
    const nameB = b.toString().toLowerCase();

    if (nameA === ROOT_GROUP) {
      return -1;
    }
    if (nameB === ROOT_GROUP) {
      return 1;
    }
    return 0;
  });
};

const extractAssetGroups = (
  clusterAssetGroups?: ClusterAssetGroup[],
): ClusterAssetGroups | undefined => {
  if (!clusterAssetGroups) {
    return undefined;
  }

  const cdts: ClusterAssetGroups = {};
  const groups = extractGroups(clusterAssetGroups);

  groups.forEach(group => {
    const items: ClusterAssetGroup[] = [];
    clusterAssetGroups.forEach(cdt => {
      if (cdt.groupName === group) {
        items.push(cdt);
      }
    });
    cdts[group] = items;
  });
  return cdts;
};

const CLUSTER_ASSET_GROUPS = gql`
  query clusterAssetGroups(
    $viewContext: String
    $groupName: String
    $filterExtensions: [String!]
  ) {
    clusterAssetGroups(viewContext: $viewContext, groupName: $groupName) {
      name
      displayName
      description
      groupName
      assets {
        name
        parameters
        type
        files(filterExtensions: $filterExtensions) {
          url
          metadata
        }
      }
    }
  }
`;

interface QData {
  clusterAssetGroups: ClusterAssetGroup[];
}

interface QVars {
  filterExtensions: string[];
  viewContext: string;
}

const useQueries = () => {
  const { data, error, loading } = useQuery<QData, QVars>(
    CLUSTER_ASSET_GROUPS,
    {
      variables: {
        filterExtensions: FILTER_EXTENSIONS,
        viewContext: VIEW_CONTEXT,
      },
    },
  );
  const clusterAssetGroups = extractAssetGroups(
    data && data.clusterAssetGroups,
  );

  return {
    clusterAssetGroups,
    error,
    loading,
  };
};

const { Provider, Context } = createContainer(useQueries);
export { Provider as QueriesProvider, Context as QueriesService };
