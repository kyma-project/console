import gql from 'graphql-tag';

export default {
  Query: {
    clusterServiceClassFilters: (_, args, { cache }) => {
      const result =
        cache.readQuery({
          query: gql`
            query ServiceClassesFilterData {
              clusterServiceClasses {
                name
                providerDisplayName
                tags
              }
            }
          `,
        }) || [];

      return populateServiceClassFilters(result.clusterServiceClasses);
    },
  },
  Mutation: {
    setActiveFilters: (_, args, { cache }) => {
      const filters = cache.readQuery({
        query: gql`
          query activeServiceClassFilters {
            activeServiceClassFilters @client {
              provider
              tag
            }
          }
        `,
      }).activeServiceClassFilters;
      let newActive = filters;
      if (Array.isArray(newActive[args.key])) {
        let newArray = newActive[args.key];
        if (args.value === null) {
          newArray = [];
        } else if (newArray.includes(args.value)) {
          newArray = newActive[args.key].filter(e => e !== args.value);
        } else {
          newArray = newArray.concat(args.value);
        }
        newActive[args.key] = newArray;
      } else {
        newActive[args.key] = args.value;
      }

      cache.writeData({
        data: {
          activeServiceClassFilters: newActive,
        },
      });

      return newActive;
    },
    setActiveTagsFilters: (_, args, { cache }) => {
      const filters = cache.readQuery({
        query: gql`
          query activeTagsFilters {
            activeTagsFilters @client {
              provider {
                first
                isMore
                offset
              }
              tag {
                first
                isMore
                offset
              }
              search
            }
          }
        `,
      }).activeTagsFilters;

      const newActive = { ...filters };
      newActive[args.key] = args.value;

      cache.writeData({
        data: {
          activeTagsFilters: newActive,
        },
      });

      return newActive;
    },
    filterServiceClasses: (_, args, { cache }) => {
      const activeFilters = cache.readQuery({
        query: gql`
          query activeServiceClassFilters {
            activeServiceClassFilters @client {
              provider
              tag
              search
            }
          }
        `,
      }).activeServiceClassFilters;

      const activeTagsFilters = cache.readQuery({
        query: gql`
          query activeTagsFilters {
            activeTagsFilters @client {
              provider {
                first
                isMore
                offset
              }
              tag {
                first
                isMore
                offset
              }
              search
            }
          }
        `,
      }).activeTagsFilters;

      let classes = cache.readQuery({
        query: gql`
          query ClusterServiceClasses {
            clusterServiceClasses {
              name
              description
              displayName
              externalName
              imageUrl
              activated
              providerDisplayName
              tags
            }
          }
        `,
      }).clusterServiceClasses;

      const filteredClasses = filterServiceClasses(
        classes,
        activeFilters,
        cache,
      );
      const classFilters = populateServiceClassFilters(
        classes,
        filteredClasses,
        activeTagsFilters,
      );

      cache.writeData({
        data: {
          clusterServiceClassFilters: classFilters,
          filteredServiceClasses: filteredClasses,
        },
      });

      return classes;
    },
  },
};

const populateServiceClassFilters = (
  allItems,
  filteredItems = [],
  activeTagsFilters,
) => {
  if (allItems.length === 0) {
    return [];
  }

  const providers = [];
  const tags = [];
  allItems.forEach(item => {
    if (item) {
      if (item.providerDisplayName) {
        providers.push(item.providerDisplayName);
      }
      tags.push(...item.tags);
    }
  });

  const filteredProviders = [];
  const filteredTags = [];
  filteredItems.forEach(item => {
    if (item) {
      if (item.providerDisplayName) {
        filteredProviders.push(item.providerDisplayName);
      }
      filteredTags.push(...item.tags);
    }
  });

  const tagsValues = getFilterValues(
    tags,
    filteredTags,
    activeTagsFilters,
    'tag',
  );
  const providersValues = getFilterValues(
    providers,
    filteredProviders,
    activeTagsFilters,
    'provider',
  );

  return [
    {
      name: 'tag',
      values: tagsValues.values,
      isMore: tagsValues.isMore,
      __typename: 'Filter',
    },
    {
      name: 'provider',
      values: providersValues.values,
      isMore: providersValues.isMore,
      __typename: 'Filter',
    },
  ];
};

const getFilterValues = (
  values,
  filteredValues = [],
  additionalFilters,
  type,
) => {
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

  let valuesArray = Object.values(valuesMap);
  let valuesLength = valuesArray.length + 1;
  if (additionalFilters) {
    const filterFiltersResult = filterFilters(
      valuesArray,
      additionalFilters,
      type,
    );
    valuesArray = filterFiltersResult.values;
    valuesLength = filterFiltersResult.length + 1;
  }
  valuesArray.unshift({
    name: 'All',
    value: null,
    count: null,
    __typename: 'FilterItem',
  });
  const isMore = valuesLength > valuesArray.length;

  return { values: valuesArray, isMore };
};

const filterFilters = (filters, activeFilters, type) => {
  let filteredFilters = filters;
  const first = activeFilters[type].first;
  const offset = activeFilters[type].offset;

  if (typeof activeFilters.search === 'string' && activeFilters.search !== '') {
    filteredFilters = searchInFilters(filters, activeFilters.search);
  }

  const filteredFiltersLength = filteredFilters.length;
  if (filteredFilters.length > offset && first >= 0 && offset > 0) {
    filteredFilters = filteredFilters.slice(first, first + offset);
  }
  return { values: filteredFilters, length: filteredFiltersLength };
};

const searchInFilters = (filters, search) => {
  let filteredFilters = [];
  const searchValue = search.toLowerCase();

  filteredFilters = filters.filter(item => {
    let searchMatch = true;
    searchMatch = item.name.toLowerCase().indexOf(searchValue) !== -1;
    return searchMatch;
  });
  return filteredFilters;
};

const filterServiceClasses = (classes, activeFilters) => {
  const filteredClasses = classes.filter(item => {
    let providerMatch = true;
    let tagMatch = true;
    let searchMatch = true;

    if (activeFilters.provider && activeFilters.provider.length > 0) {
      providerMatch = activeFilters.provider.some(provider =>
        item.providerDisplayName.includes(provider),
      );
    }

    if (activeFilters.tag && activeFilters.tag.length > 0) {
      tagMatch = activeFilters.tag.some(tag => item.tags.includes(tag));
    }

    if (
      typeof activeFilters.search === 'string' &&
      activeFilters.search !== ''
    ) {
      const searchValue = activeFilters.search.toLowerCase();
      const name = item.displayName.toLowerCase();
      const description = item.description.toLowerCase();
      const provider = item.providerDisplayName.toLowerCase();
      searchMatch =
        name.indexOf(searchValue) !== -1 ||
        description.indexOf(searchValue) !== -1 ||
        provider.indexOf(searchValue) !== -1;
    }
    return providerMatch && tagMatch && searchMatch;
  });

  return filteredClasses;
};
