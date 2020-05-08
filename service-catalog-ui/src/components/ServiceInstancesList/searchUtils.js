import { serviceInstanceConstants } from 'helpers/constants';
import { isAddon, isService } from 'helpers';

function determineDisplayedInstances(
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

function determineAvailableLabels(serviceInstances, tabName, searchQuery) {
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

export { determineAvailableLabels, determineDisplayedInstances };
