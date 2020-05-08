import {
  serviceInstanceConstants,
  serviceClassConstants,
} from 'helpers/constants';
import { isAddon, isService } from 'helpers';

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
    tabIndex === serviceInstanceConstants.addonsIndex ? isAddon : isService;

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

export const determineDisplayedServiceClasses = (
  serviceClasses,
  tabIndex,
  searchQuery,
  activeLabels,
) => {
  const searched = serviceClasses.filter(item => {
    const searchRegexp = new RegExp(searchQuery, 'i');

    return (
      searchRegexp.test(item.displayName) ||
      searchRegexp.test(item.description) ||
      searchRegexp.test(item.providerDisplayName)
    );
  });

  const filteredByLabels = searched.filter(item =>
    activeLabels.every(activeLabel => item.labels.includes(activeLabel)),
  );

  const filterFunction =
    tabIndex === serviceClassConstants.addonsIndex ? isAddon : isService;

  const filteredByTab = filteredByLabels.filter(filterFunction);

  return filteredByTab;
};
