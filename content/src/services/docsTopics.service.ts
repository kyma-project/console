import { useState, useEffect, useContext } from 'react';
import createContainer from 'constate';

import { QueriesService } from './queries.service';
import { NavigationService, ActiveNavNode } from './navigation.service';
import { ClusterDocsTopics, ClusterDocsTopic } from './types';

const newActiveDocsTopic = ({
  docsTopics,
  activeNavNode,
  activeDocsTopic,
}: {
  docsTopics?: ClusterDocsTopics;
  activeNavNode: ActiveNavNode;
  activeDocsTopic: ClusterDocsTopic | null;
}): ClusterDocsTopic | undefined => {
  if (!activeNavNode) {
    return;
  }

  const { group, topic } = activeNavNode;
  const newDocsTopic =
    docsTopics &&
    docsTopics[group] &&
    docsTopics[group].find(dt => dt.name === topic);

  if (
    activeDocsTopic &&
    newDocsTopic &&
    activeDocsTopic.name === newDocsTopic.name
  ) {
    return;
  }
  return newDocsTopic;
};

const useDocsTopics = () => {
  const { docsTopics } = useContext(QueriesService);
  const { activeNavNode } = useContext(NavigationService);
  const [
    activeDocsTopic,
    setActiveDocsTopic,
  ] = useState<ClusterDocsTopic | null>(null);

  useEffect(() => {
    const newDocsTopic = newActiveDocsTopic({
      docsTopics,
      activeNavNode,
      activeDocsTopic,
    });
    newDocsTopic && setActiveDocsTopic(newDocsTopic);
  }, [docsTopics, activeNavNode, activeDocsTopic]);

  return {
    activeDocsTopic,
  };
};

const { Provider, Context } = createContainer(useDocsTopics, context => [
  context.activeDocsTopic,
]);
export { Provider as DocsTopicsProvider, Context as DocsTopicsService };
