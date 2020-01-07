function handleNamespaceWsEvent(namespaceEvent, prev) {
  let updatedNamespaces = {};

  switch (namespaceEvent.type) {
    case 'ADD':
      if (
        !prev.namespaces.find(n => n.name === namespaceEvent.namespace.name)
      ) {
        updatedNamespaces = {
          namespaces: [...prev.namespaces, namespaceEvent.namespace],
        };
      } else {
        return prev;
      }
      break;
    case 'UPDATE':
      const updatedNamespaceIndex = prev.namespaces.findIndex(
        n => n.name === namespaceEvent.namespace.name,
      );
      if (updatedNamespaceIndex === -1) {
        updatedNamespaces = {
          namespaces: [...prev.namespaces, namespaceEvent.namespace],
        };
      } else {
        updatedNamespaces = {
          namespaces: [...prev.namespaces],
        };
        updatedNamespaces.namespaces[updatedNamespaceIndex] = {
          ...namespaceEvent.namespace,
        };
      }
      break;

    case 'DELETE':
      updatedNamespaces = {
        namespaces: prev.namespaces.filter(
          n => n.name !== namespaceEvent.namespace.name,
        ),
      };
      break;
    default:
      return prev;
  }

  return updatedNamespaces;
}

export { handleNamespaceWsEvent };
