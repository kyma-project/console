import { serviceInstanceConstants } from 'helpers/constants';
import {
  isServiceInstance,
  isAddonInstance,
  isAddon,
  isService,
} from 'helpers';

export function determineDisplayedInstances(
  serviceInstances,
  tabIndex,
  searchQuery,
  activeLabels,
) {
  const searched = serviceInstances.filter(instance =>
    new RegExp(searchQuery, 'i').test(instance.name),
  );

  const filteredByLabels = searched.filter(instance =>
    activeLabels.every(activeLabel => instance.labels.includes(activeLabel)),
  );

  const filterFunction =
    tabIndex === serviceInstanceConstants.addonsIndex
      ? isAddonInstance
      : isServiceInstance;

  const filteredByTab = filteredByLabels.filter(filterFunction);

  return filteredByTab;
}

export function determineAvailableLabels(
  serviceInstances,
  tabName,
  searchQuery,
) {
  const displayedInstances = determineDisplayedInstances(
    serviceInstances,
    tabName,
    searchQuery,
    [],
  );

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
}

export const determineDisplayedItems = (serviceClasses, searchQuery) => {
  const searched = serviceClasses.filter(item => {
    const searchRegexp = new RegExp(searchQuery, 'i');

    return (
      searchRegexp.test(item.displayName) ||
      searchRegexp.test(item.description) ||
      searchRegexp.test(item.providerDisplayName)
    );
  });

  return [searched.filter(isService), searched.filter(isAddon)];
};
