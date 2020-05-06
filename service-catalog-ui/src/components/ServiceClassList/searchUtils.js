import { serviceClassConstants } from 'helpers/constants';
import { isAddon, isService } from 'helpers/helpers';

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

  const filterFunction =
    tabIndex === serviceClassConstants.addonsIndex ? isAddon : isService;

  const filteredByTab = filteredByLabels.filter(filterFunction);

  return filteredByTab;
};

const determineAvailableLabels = (serviceClasses, tabName, searchQuery) => {
  // const displayedInstances = determineDisplayedServiceClasses(
  //   serviceClasses,
  //   tabName,
  //   searchQuery,
  //   [],
  // );
  // TODO
  return [];
};

export { determineAvailableLabels, determineDisplayedServiceClasses };
