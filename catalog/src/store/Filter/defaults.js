const defaults = {
  activeServiceClassFilters: {
    basic: [],
    provider: [],
    tag: [],
    connectedApplication: [],
    search: '',
    __typename: 'ActiveServiceClassFilters',
  },
  activeTagsFilters: {
    basic: {
      first: 0,
      offset: 4,
      isMore: true,
      __typename: 'ActiveTagsFiltersBasic',
    },
    provider: {
      first: 0,
      offset: 4,
      isMore: true,
      __typename: 'ActiveTagsFiltersProvider',
    },
    tag: {
      first: 0,
      offset: 4,
      isMore: true,
      __typename: 'ActiveTagsFiltersTag',
    },
    connectedApplication: {
      first: 0,
      offset: 4,
      isMore: true,
      __typename: 'ActiveTagsFiltersConnectedApplication',
    },
    search: '',
    __typename: 'ActiveTagsFilters',
  },
  serviceClassFilters: [],
  filteredServiceClasses: [],
};

module.exports = defaults;
