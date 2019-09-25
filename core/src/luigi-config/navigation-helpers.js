export const hideDisabledNodes = (disabledNavNodes, nodes, namespace) => {
  if (disabledNavNodes !== null && disabledNavNodes !== undefined) {
    const disabledNavNodesArray = disabledNavNodes.split(' ');
    if (disabledNavNodesArray && disabledNavNodesArray.length > 0) {
      nodes.forEach(node => {
        // namespace node have pattern 'namespace.category.label' or 'namespace.label' if doesn't have category
        // cluster node have pattern 'category.label' or 'label' if doesn't have category
        const nodeCategory = node.category
          ? node.category.label
            ? node.category.label
                .split(' ')
                .join('')
                .toLowerCase()
            : node.category
                .split(' ')
                .join('')
                .toLowerCase()
          : '';
        const categoryId = namespace
          ? nodeCategory
            ? `namespace.${nodeCategory}`
            : 'namespace'
          : nodeCategory;

        const nodeLabel = node.label
          ? node.label
              .split(/ |-/)
              .join('')
              .toLowerCase()
          : '';
        const nodeId = `${categoryId}${
          categoryId && nodeLabel ? '.' : ''
        }${nodeLabel}`;

        const shouldBeDisabled = element =>
          element && (element === categoryId || element === nodeId);
        node.hideFromNav = disabledNavNodesArray.some(shouldBeDisabled);
      });
    }
  }
};

export const getSystemNamespaces = namespaces => {
  return namespaces ? namespaces.split(' ') : [];
};

export const shouldShowSystemNamespaces = () => {
  let showSystemNamespaces = false;
  if (localStorage.getItem('console.showSystemNamespaces')) {
    showSystemNamespaces =
      localStorage.getItem('console.showSystemNamespaces') === 'true';
  }
  return showSystemNamespaces;
};

export const saveCurrentLocation = () => {
  if (!window.location.hash) {
    const location = window.location.href;
    localStorage.setItem('console.location', location);
  }
}

export const getPreviousLocation = () => {
  const prevLocation = localStorage.getItem('console.location');
  if (prevLocation) {
    localStorage.removeItem('console.location'); 
  }
  return prevLocation;
}