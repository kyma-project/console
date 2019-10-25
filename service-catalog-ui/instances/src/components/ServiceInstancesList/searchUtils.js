import { serviceInstanceConstants } from '../../variables';

const determineDisplayedInstances = (
  serviceInstances,
  tabIndex,
  searchQuery,
  activeLabels,
) => {
  console.log('determineDisplayedInstances serviceInstances', serviceInstances);
  const searched = serviceInstances.filter(instance =>
    new RegExp(searchQuery, 'i').test(instance.name),
  );

  const filteredByLabels = searched.filter(instance =>
    activeLabels.every(activeLabel => instance.labels.includes(activeLabel)),
  );

  let filteredByTab = [];
  if (tabIndex === serviceInstanceConstants.addonsIndex) {
    filteredByTab = filteredByLabels.filter(instance => {
      if (instance.clusterServiceClass && instance.clusterServiceClass.labels) {
        return instance.clusterServiceClass.labels.local === 'true';
      }
      return false;
    });
  }
  if (tabIndex === serviceInstanceConstants.servicesIndex) {
    filteredByTab = filteredByLabels.filter(instance => {
      if (instance.clusterServiceClass && instance.clusterServiceClass.labels) {
        return instance.clusterServiceClass.labels.local !== 'true';
      }
      return true;
    });
  }

  return filteredByTab;
};

const determineAvailableLabels = (serviceInstances, tabName, searchQuery) => {
  const displayedInstances = determineDisplayedInstances(
    serviceInstances,
    tabName,
    searchQuery,
    [],
  );
  console.log('serviceInstances', serviceInstances);
  const allLabels = serviceInstances.reduce(
    (labelsCombined, instance) => [...labelsCombined, ...instance.labels],
    [],
  );

  const labelsWithOccurrences = allLabels.reduce(
    (labelsWithOccurrences, label) => ({
      ...labelsWithOccurrences,
      [label]: 0,
    }),
    {},
  );

  displayedInstances.forEach(instance => {
    instance.labels.forEach(label => {
      ++labelsWithOccurrences[label];
    });
  });

  return labelsWithOccurrences;
};

export { determineAvailableLabels, determineDisplayedInstances };
