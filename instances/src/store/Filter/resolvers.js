import gql from 'graphql-tag';
import { SERVICE_INSTANCES_QUERY } from '../../components/DataProvider/queries';
import builder from '../../commons/builder';
import { transformDataScalarObjectsToStrings } from '../transformers';

const getActiveFilters = cache => {
  return (
    cache.readQuery({
      query: gql`
        query activeFilters {
          activeFilters @client {
            search
            labels
            local
          }
        }
      `,
    }).activeFilters || null
  );
};

export default {
  Query: {
    itemFilters: (_, args, { cache }) => {
      const result =
        cache.readQuery({
          query: gql`
            query InstanceFilterData {
              serviceInstances {
                name
                labels
              }
            }
          `,
        }) || [];

      return populateFilters(result.serviceInstances);
    },
  },
  Mutation: {
    setActiveFilters: (_, args, { cache }) => {
      const activeFilters = getActiveFilters(cache);
      const newActive = { ...activeFilters };

      if (args.key === 'labels') {
        const previousLabels = activeFilters.labels;
        const labelAlreadyInActiveFilter = previousLabels.some(
          label => label === args.value,
        );

        if (labelAlreadyInActiveFilter) {
          newActive.labels = newActive.labels.filter(
            label => label !== args.value,
          );
        } else {
          const labels = [...newActive.labels];
          labels.push(args.value);
          newActive.labels = labels;
        }
      } else {
        newActive[args.key] = args.value;
      }

      cache.writeData({
        data: {
          activeFilters: newActive,
        },
      });

      return newActive;
    },
    filterItems: (_, _args, { cache }) => {
      const activeFilters = getActiveFilters(cache);

      let items = cache.readQuery({
        query: SERVICE_INSTANCES_QUERY,
        variables: {
          namespace: builder.getCurrentEnvironmentId(),
        },
      }).serviceInstances;
      items = transformDataScalarObjectsToStrings(items);

      const filteredItemsAndCounts = filterItems(items, activeFilters, cache);
      let filteredItems = filteredItemsAndCounts.filteredItems;
      let counts = filteredItemsAndCounts.counts;
      const allFilters = populateFilters(items, filteredItems);

      cache.writeData({
        data: {
          allFilters,
          filteredItems,
          filteredInstancesCounts: counts,
        },
      });

      return filteredItems;
    },
  },
};

const populateFilters = (allItems, filteredItems = []) => {
  if (allItems.length === 0) {
    return [];
  }

  const providers = [];
  const labels = [];
  allItems.forEach(item => {
    if (item) {
      providers.push(item.providerDisplayName);
      labels.push(...item.labels);
    }
  });

  const filteredProviders = [];
  const filteredLabels = [];
  filteredItems.forEach(item => {
    if (item) {
      filteredProviders.push(item.providerDisplayName);
      filteredLabels.push(...item.labels);
    }
  });

  return [
    {
      name: 'labels',
      values: getFilterValues(labels, filteredLabels),
      __typename: 'Filter',
    },
  ];
};

const getFilterValues = (values, filteredValues = []) => {
  const uniqueValues = new Set(values);
  const valuesCount = filteredValues.reduce((filteredValues, item) => {
    const prevCount = filteredValues[item];
    filteredValues[item] = (prevCount ? prevCount : 0) + 1;
    return filteredValues;
  }, {});

  const valuesMap = [...uniqueValues].reduce((values, item) => {
    const countVal = valuesCount[item];
    values[item] = {
      name: item,
      value: item,
      count: typeof countVal === 'number' ? countVal : 0,
      __typename: 'FilterItem',
    };
    return values;
  }, {});

  return Object.values(valuesMap);
};

const filterItems = (items = [], activeFilters, cache) => {
  let counts = {
    local: 0,
    notLocal: 0,
    __typename: 'FilteredInstancesCounts',
  };

  const filteredItems = items.filter(item => {
    let searchMatch = true;
    let labelsMatch = true;
    let isLocalConditionPresent = true;

    const serviceClass = item.serviceClass || item.clusterServiceClass;
    if (typeof activeFilters.local === 'boolean') {
      const serviceClassLabels = serviceClass ? serviceClass.labels : {};

      isLocalConditionPresent = activeFilters.local
        ? serviceClassLabels && serviceClassLabels.local
        : serviceClassLabels && !serviceClassLabels.local;
    }

    if (activeFilters.labels && activeFilters.labels.length > 0) {
      activeFilters.labels.forEach(label => {
        if (!item.labels.includes(label)) {
          labelsMatch = false;
        }
      });
    }

    if (
      typeof activeFilters.search === 'string' &&
      activeFilters.search !== ''
    ) {
      const searchValue = activeFilters.search.toLowerCase();
      const name = item.name.toLowerCase();

      const servicePlan = item.servicePlan || item.clusterServicePlan;
      const serviceClassName = serviceClass
        ? serviceClass.displayName.toLowerCase()
        : '';
      const planName = servicePlan ? servicePlan.displayName.toLowerCase() : '';

      const statusType = item.status.type.toLowerCase();
      searchMatch =
        name.indexOf(searchValue) !== -1 ||
        (serviceClass && serviceClassName.indexOf(searchValue) !== -1) ||
        (servicePlan && planName.indexOf(searchValue) !== -1) ||
        statusType.indexOf(searchValue) !== -1;
    }

    const match = labelsMatch && searchMatch;

    const isLocal =
      (activeFilters.local && isLocalConditionPresent) ||
      !(activeFilters.local || isLocalConditionPresent);

    if (match) {
      isLocal ? counts.local++ : counts.notLocal++;
    }

    return isLocalConditionPresent && match;
  });

  return { counts, filteredItems };
};
