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
) {
  const searched = serviceInstances.filter(instance =>
    new RegExp(searchQuery, 'i').test(instance.metadata.name),
  );

  const filterFunction =
    tabIndex === serviceInstanceConstants.addonsIndex
      ? isAddonInstance
      : isServiceInstance;

  return searched.filter(filterFunction);
}

export const determineDisplayedItems = (serviceClasses, searchQuery) => {
  const searched = serviceClasses.filter(item => {
    const searchRegexp = new RegExp(searchQuery, 'i');

    return (
      searchRegexp.test(item.spec.externalMetadata?.displayName) ||
      searchRegexp.test(item.spec.description) ||
      searchRegexp.test(item.spec.externalMetadata?.providerDisplayName)
    );
  });

  return [
    searched.filter(item => {
      return isService(item.spec.externalMetadata?.labels);
    }),
    searched.filter(item => {
      return isAddon(item.spec.externalMetadata?.labels);
    }),
  ];
};
