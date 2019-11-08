import { serviceClassConstants } from '../../variables';

const determineDisplayedServiceClasses = (
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

  let filteredByTab = [];
  if (tabIndex === serviceClassConstants.addonsIndex) {
    filteredByTab = filteredByLabels.filter(item => {
      if (item.labels) {
        return item.labels.local === 'true';
      }
      return false;
    });
  }
  if (tabIndex === serviceClassConstants.servicesIndex) {
    filteredByTab = filteredByLabels.filter(item => {
      if (item.labels) {
        return item.labels.local !== 'true';
      }
      return true;
    });
  }

  return filteredByTab;
};

const determineAvailableLabels = (serviceClasses, tabName, searchQuery) => {
  const displayedInstances = determineDisplayedServiceClasses(
    serviceClasses,
    tabName,
    searchQuery,
    [],
  );
  // TODO
  return [];
};

export { determineAvailableLabels, determineDisplayedServiceClasses };
