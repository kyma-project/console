import gql from 'graphql-tag';

import { isStringValueEqualToTrue } from '../../commons/helpers';
import builder from '../../commons/builder';

export default {
  Query: {
    serviceClassFilters: (_, args, { cache }) => {
      const serviceClassesFilterDataQGL = `
        name
        providerDisplayName
        tags
        labels
      `;
      try {
        let result = cache.readQuery({
          query: gql`
              query serviceClassesFilterData($namespace: String!) {
                clusterServiceClasses {
                  ${serviceClassesFilterDataQGL}
                }
                serviceClasses(namespace: $namespace) {
                  ${serviceClassesFilterDataQGL}
                }
              }
            `,
          variables: {
            namespace: builder.getCurrentEnvironmentId(),
          },
        });
        result =
          result && Object.keys(result).length
            ? [...result.clusterServiceClasses, ...result.serviceClasses]
            : [];

        return populateServiceClassFilters(result);
      } catch (error) {
        return;
      }
    },
  },
  Mutation: {
    clearAllActiveFilters: (_, args, { cache }) => {
      const newActive = {
        basic: [],
        provider: [],
        tag: [],
        connectedApplication: [],
        __typename: 'ActiveServiceClassFilters',
      };

      cache.writeData({
        data: {
          activeServiceClassFilters: newActive,
        },
      });

      return newActive;
    },
    setActiveFilters: (_, args, { cache }) => {
      const filters = cache.readQuery({
        query: gql`
          query activeServiceClassFilters {
            activeServiceClassFilters @client {
              basic
              provider
              tag
              connectedApplication
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
      const activeTagsFiltersQGL = `
        first
        isMore
        offset
      `;

      const filters = cache.readQuery({
        query: gql`
          query activeTagsFilters {
            activeTagsFilters @client {
              basic {
                ${activeTagsFiltersQGL}
              }
              provider {
                ${activeTagsFiltersQGL}
              }
              tag {
                ${activeTagsFiltersQGL}
              }
              connectedApplication {
                ${activeTagsFiltersQGL}
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
              basic
              provider
              tag
              local
              connectedApplication
              search
            }
          }
        `,
      }).activeServiceClassFilters;

      const activeTagsFiltersQGL = `
        first
        isMore
        offset
      `;
      const activeTagsFilters = cache.readQuery({
        query: gql`
          query activeTagsFilters {
            activeTagsFilters @client {
              basic {
                ${activeTagsFiltersQGL}
              }
              provider {
                ${activeTagsFiltersQGL}
              }
              tag {
                ${activeTagsFiltersQGL}
              }
              connectedApplication {
                ${activeTagsFiltersQGL}
              }
              search
            }
          }
        `,
      }).activeTagsFilters;

      const serviceClassesQGL = `
        name
        description
        displayName
        externalName
        imageUrl
        providerDisplayName
        tags
        labels
      `;
      let classes = cache.readQuery({
        query: gql`
          query serviceClasses($namespace: String!) {
            clusterServiceClasses {
              ${serviceClassesQGL}
            }
            serviceClasses(namespace: $namespace) {
              ${serviceClassesQGL}
            }
          }
        `,
        variables: {
          namespace: args.namespace,
        },
      });
      classes =
        classes && Object.keys(classes).length
          ? [...classes.clusterServiceClasses, ...classes.serviceClasses]
          : [];

      const filteredClassesAndCounts = filterServiceClasses(
        classes,
        activeFilters,
        cache,
      );
      let filteredClasses = filteredClassesAndCounts.filteredClasses;
      let counts = filteredClassesAndCounts.counts;

      const filteredFilters = populateServiceClassFilters(
        classes,
        filteredClasses,
        activeTagsFilters,
      );
      filteredClasses = filteredClasses.map(filteredClass => {
        return filteredClass;
      });

      cache.writeData({
        data: {
          serviceClassFilters: filteredFilters,
          filteredServiceClasses: filteredClasses,
          filteredClassesCounts: counts,
        },
      });

      return filteredClasses;
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

  const basic = [];
  const providers = [];
  const tags = [];
  const connectedApplications = [];
  allItems.forEach(item => {
    if (item) {
      if (item.providerDisplayName) {
        providers.push(item.providerDisplayName);
      }

      const labels = item.labels || {};
      if (labels['connected-app']) {
        connectedApplications.push(labels['connected-app']);
      }
      if (isStringValueEqualToTrue(labels.showcase)) {
        basic.push('showcase');
      }
      if (isStringValueEqualToTrue(labels.provisionOnlyOnce)) {
        basic.push('provisionOnlyOnce');
      }

      tags.push(...item.tags);
    }
  });

  const filteredBasic = [];
  const filteredProviders = [];
  const filteredTags = [];
  const filteredConnectedApplications = [];
  filteredItems.forEach(item => {
    if (item) {
      if (item.providerDisplayName) {
        filteredProviders.push(item.providerDisplayName);
      }

      const labels = item.labels || {};
      if (labels['connected-app']) {
        filteredConnectedApplications.push(labels['connected-app']);
      }
      if (isStringValueEqualToTrue(labels.local)) {
        filteredBasic.push('local');
      }
      if (isStringValueEqualToTrue(labels.showcase)) {
        filteredBasic.push('showcase');
      }
      if (isStringValueEqualToTrue(labels.provisionOnlyOnce)) {
        filteredBasic.push('provisionOnlyOnce');
      }

      filteredTags.push(...item.tags);
    }
  });

  const basicValues = getFilterValues(
    basic,
    filteredBasic,
    activeTagsFilters,
    'basic',
  );
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
  const connectedApplicationsValues = getFilterValues(
    connectedApplications,
    filteredConnectedApplications,
    activeTagsFilters,
    'connectedApplication',
  );

  return [
    {
      name: 'basic',
      values: basicValues.values,
      isMore: basicValues.isMore,
      __typename: 'Filter',
    },
    {
      name: 'tag',
      values: tagsValues.values,
      isMore: tagsValues.isMore,
      __typename: 'Filter',
    },
    {
      name: 'connectedApplication',
      values: connectedApplicationsValues.values,
      isMore: connectedApplicationsValues.isMore,
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
  let counts = {
    local: 0,
    notLocal: 0,
    __typename: 'FilteredClassesCounts',
  };
  const filteredClasses = classes.filter(item => {
    let localMatch = true;
    let basicMatch = true;
    let providerMatch = true;
    let tagMatch = true;
    let connectedApplicationMatch = true;
    let searchMatch = true;

    if (typeof activeFilters.local === 'boolean') {
      localMatch = activeFilters.local
        ? item.labels && item.labels.local
        : item.labels && !item.labels.local;
    }

    if (activeFilters.basic && activeFilters.basic.length > 0) {
      basicMatch = activeFilters.basic.some(
        basicFilter => item.labels && item.labels[basicFilter],
      );
    }

    if (activeFilters.provider && activeFilters.provider.length > 0) {
      providerMatch = activeFilters.provider.some(provider =>
        item.providerDisplayName.includes(provider),
      );
    }

    if (activeFilters.tag && activeFilters.tag.length > 0) {
      tagMatch = activeFilters.tag.some(tag => item.tags.includes(tag));
    }

    if (
      activeFilters.connectedApplication &&
      activeFilters.connectedApplication.length > 0
    ) {
      connectedApplicationMatch = activeFilters.connectedApplication.some(
        app => item.labels && item.labels['connected-app'] === app,
      );
    }

    if (
      typeof activeFilters.search === 'string' &&
      activeFilters.search !== ''
    ) {
      const searchValue = activeFilters.search.toLowerCase();
      const name = item.displayName.toLowerCase();
      const description = item.description.toLowerCase();
      const provider = item.providerDisplayName.toLowerCase();
      const tags = item.tags.map(tag => tag.toLowerCase());
      let labels = [];

      if (item.labels) {
        if (item.labels['connected-app']) {
          labels.push('connected-app');
          labels.push('connectedapp');
          labels.push(item.labels['connected-app']);
        }
        if (isStringValueEqualToTrue(item.labels.local)) {
          labels.push('local');
        }
        if (isStringValueEqualToTrue(item.labels.showcase)) {
          labels.push('showcase');
        }
        if (isStringValueEqualToTrue(item.labels.provisionOnlyOnce)) {
          labels.push('provisionOnlyOnce');
          labels.push('provision-only-once');
        }
      }

      searchMatch =
        name.indexOf(searchValue) !== -1 ||
        description.indexOf(searchValue) !== -1 ||
        provider.indexOf(searchValue) !== -1 ||
        tags.filter(tag => tag.indexOf(searchValue) !== -1).length ||
        labels.filter(label => label.indexOf(searchValue) !== -1).length;
    }

    const match =
      basicMatch &&
      providerMatch &&
      tagMatch &&
      connectedApplicationMatch &&
      searchMatch;

    const isLocal =
      (activeFilters.local && localMatch) ||
      !(activeFilters.local || localMatch);

    if (match) {
      isLocal ? counts.local++ : counts.notLocal++;
    }

    return localMatch && match;
  });

  return { counts, filteredClasses };
};
