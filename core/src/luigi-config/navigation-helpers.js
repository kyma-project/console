const hideDisabledNodes = (disabledNavNodes, nodes, namespace) => {
  if (disabledNavNodes && disabledNavNodes.length > 0) {
    nodes.forEach(node => {

      // namespace node have pattern 'namespace.category.label' or 'namespace.label' if doesn't have category
      // cluster node have pattern 'category.label' or 'label' if doesn't have category
      const nodeCategory = node.category
        ? node.category.label 
          ? node.category.label.split(' ').join('').toLowerCase()
          : node.category.split(' ').join('').toLowerCase()
        : '';
      const categoryId = namespace 
        ? nodeCategory 
          ? `namespace.${nodeCategory}` 
          : 'namespace'
        : nodeCategory;
      
      const nodeLabel = node.label 
        ? node.label.split(/ |-/).join('').toLowerCase()
        : '';
      const nodeId = `${categoryId}${categoryId && nodeLabel ? '.': ''}${nodeLabel}`;
      
      const shouldBeDisabled = (element) => {
        return (element === categoryId || element === nodeId);
      }
      node.hideFromNav = disabledNavNodes.some(shouldBeDisabled);

    });
  }
}

module.exports = {
  hideDisabledNodes
};
