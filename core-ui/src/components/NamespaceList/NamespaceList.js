import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
  GET_NAMESPACES,
  NAMESPACES_EVENT_SUBSCRIPTION,
} from '../../queries/queries';
import { Spinner } from '@kyma-project/react-components';

export default function NamespaceList() {
  const showSystemNamespaces = Boolean(
    localStorage.getItem('console.showSystemNamespaces'),
  );
  const { data, error, loading, subscribeToMore } = useQuery(GET_NAMESPACES, {
    variables: {
      showSystemNamespaces,
    },
  });

  const handleNamespaceEvent = (obj = {}, event = {}) => {
    const currentItems = obj.namespaces || [];
    const targetItem = event.namespace;
    if (!targetItem) {
      return obj;
    }

    let result, idx;
    const items = [...currentItems];
    switch (event.type) {
      case 'ADD':
        idx = items.findIndex(i => i.name === targetItem.name);
        if (idx === -1) {
          result = [...currentItems, targetItem];
        }
        break;
      case 'UPDATE':
        idx = items.findIndex(i => i.name === targetItem.name);
        if (idx === -1) {
          result = [...currentItems, targetItem];
          break;
        }
        items[idx] = targetItem;
        result = items;
        break;
      case 'DELETE':
        result = currentItems.filter(i => i.name !== targetItem.name);
        break;
      default:
        result = items;
        break;
    }

    if (result && result.length > 0) {
      result.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    }

    return { ...obj, namespaces: result };
  };
  useEffect(() => {
    subscribeToMore({
      variables: {
        showSystemNamespaces,
      },
      document: NAMESPACES_EVENT_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        console.log('updateQuery', prev);
        console.log('updateQuery', subscriptionData);
        if (!subscriptionData.data || !subscriptionData.data.namespaceEvent) {
          return prev;
        }

        return handleNamespaceEvent(prev, subscriptionData.data.namespaceEvent);
      },
    });
  }, [subscribeToMore]);

  if (error) {
    return <p>Nie pykło!</p>;
  }

  if (loading) {
    return <Spinner />;
  }

  return data.namespaces.map(namespace => <p>{namespace.name}</p>);
}
