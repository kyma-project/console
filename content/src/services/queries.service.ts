import gql from 'graphql-tag';
import createContainer from 'constate';
import { useQuery } from '@apollo/react-hooks';

import { ClusterDocsTopic, ClusterDocsTopics } from './types';
import { FILTER_EXTENSIONS, VIEW_CONTEXT, ROOT_GROUP } from '../constants';

const extractGroups = (clusterDocsTopics: ClusterDocsTopic[]): string[] => {
  const groupNames: Set<string> = new Set<string>();
  clusterDocsTopics.forEach(cdt => groupNames.add(cdt.groupName));
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

const extractDocsTopics = (
  clusterDocsTopics?: ClusterDocsTopic[],
): ClusterDocsTopics | undefined => {
  if (!clusterDocsTopics) {
    return undefined;
  }

  const cdts: ClusterDocsTopics = {};
  const groups = extractGroups(clusterDocsTopics);

  groups.forEach(group => {
    const items: ClusterDocsTopic[] = [];
    clusterDocsTopics.forEach(cdt => {
      if (cdt.groupName === group) {
        items.push(cdt);
      }
    });
    cdts[group] = items;
  });
  return cdts;
};

const CLUSTER_DOCS_TOPICS = gql`
  query clusterDocsTopics(
    $viewContext: String
    $groupName: String
    $filterExtensions: [String!]
  ) {
    clusterDocsTopics(viewContext: $viewContext, groupName: $groupName) {
      name
      displayName
      description
      groupName
      assets {
        name
        metadata
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
  clusterDocsTopics: ClusterDocsTopic[];
}

interface QVars {
  filterExtensions: string[];
  viewContext: string;
}

const useQueries = () => {
  const { data, error, loading } = useQuery<QData, QVars>(CLUSTER_DOCS_TOPICS, {
    variables: {
      filterExtensions: FILTER_EXTENSIONS,
      viewContext: VIEW_CONTEXT,
    },
  });
  const docsTopics = extractDocsTopics(data && data.clusterDocsTopics);

  return {
    docsTopics,
    error,
    loading,
  };
};

const { Provider, Context } = createContainer(useQueries);
export { Provider as QueriesProvider, Context as QueriesService };
