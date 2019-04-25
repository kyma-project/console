const defaults = {
  activeServiceClassFilters: {
    basic: [],
    provider: [],
    tag: [],
    local: true,
    connectedApplication: [],
    search: '',
    __typename: 'ActiveServiceClassFilters',
  },
  filteredClassesCounts: {
    local: 0,
    notLocal: 0,
    __typename: 'FilteredClassesCounts',
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
