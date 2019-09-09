import { useState, useEffect, useContext } from 'react';
import createContainer from 'constate';
import { GlobalService, useLocation } from '@kyma-project/common';

import { QueriesService } from './queries.service';
import { ClusterDocsTopics, Navigation, NavigationItem } from './types';
import { ROOT_GROUP, KYMA_TOPIC } from '../constants';

export interface ActiveNavNode {
  group: string;
  topic: string;
}

const extractNavigation = (
  docsTopics?: ClusterDocsTopics,
): Navigation | undefined => {
  if (!docsTopics) {
    return undefined;
  }

  const navigation: Navigation = {};

  Object.keys(docsTopics).forEach(group => {
    const items: NavigationItem[] = [];
    docsTopics[group].forEach(dt => {
      items.push({
        name: dt.name,
        group: dt.groupName,
        displayName: dt.displayName,
      });
    });
    navigation[group] = items;
  });
  return navigation;
};

const useNavigation = () => {
  const globalContext = useContext(GlobalService) as any;
  const { docsTopics } = useContext(QueriesService);
  const { location } = useLocation();

  const [navigation, setNavigation] = useState<Navigation>();
  const [activeNavNode, setActiveNavNode] = useState<ActiveNavNode>({
    group: globalContext.group || ROOT_GROUP,
    topic: globalContext.topic || KYMA_TOPIC,
  });

  useEffect(() => {
    if (!location.state) {
      return;
    }

    setActiveNavNode({
      group: location.state.group || ROOT_GROUP,
      topic: location.state.topic || KYMA_TOPIC,
    });
  }, [location.state]);

  useEffect(() => {
    setNavigation(extractNavigation(docsTopics));
  }, [docsTopics]);

  return {
    activeNavNode,
    setActiveNavNode,
    navigation,
  };
};

const { Provider, Context } = createContainer(useNavigation, context => [
  context.activeNavNode,
  context.navigation,
]);
export { Provider as NavigationProvider, Context as NavigationService };
