const defaults = {
  activeServiceClassFilters: {
    provider: [],
    tag: [],
    search: '',
    __typename: 'ActiveServiceClassFilters',
  },
  activeTagsFilters: {
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
    search: '',
    __typename: 'ActiveTagsFilters',
  },
  clusterServiceClassFilters: [],
  filteredServiceClasses: [],
};

module.exports = defaults;
