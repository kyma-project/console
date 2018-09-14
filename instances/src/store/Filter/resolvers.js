import gql from 'graphql-tag';
import { SERVICE_INSTANCES_QUERY } from '../../components/ServiceInstances/queries';
import builder from '../../commons/builder';

const getActiveFilters = cache => {
  return cache.readQuery({
    query: gql`
      query activeFilters {
        activeFilters @client {
          search
          labels
        }
      }
    `,
  }).activeFilters;
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
    filterItems: (_, args, { cache }) => {
      const activeFilters = getActiveFilters(cache);

      const items = cache.readQuery({
        query: SERVICE_INSTANCES_QUERY,
        variables: {
          environment: builder.getCurrentEnvironmentId(),
        },
      }).serviceInstances;
      let filteredItems = filterItems(items, activeFilters, cache);
      const allFilters = populateFilters(items, filteredItems);

      // workaround for caching servicePlanSpec
      filteredItems = filteredItems.map(item => {
        return {
          ...item,
          servicePlanSpec: {
            ...item.servicePlanSpec,
            __typename: 'JSON',
          },
        };
      });

      cache.writeData({
        data: {
          allFilters: allFilters,
          filteredItems: filteredItems,
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

const filterItems = (items, activeFilters, cache) => {
  const filteredItems = items.filter(item => {
    let searchMatch = true;
    let labelsMatch = true;

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
      searchMatch = name.indexOf(searchValue) !== -1;
    }

    return labelsMatch && searchMatch;
  });

  return filteredItems;
};
