const navigation = {
  nodes: () => [
    {
      hideSideNav: true,
      pathSegment: 'overview',
      label: 'Overview',
      viewUrl: 'http://localhost:3000/',
    },
    {
      hideSideNav: true,
      pathSegment: 'runtimes',
      label: 'Runtimes',
      viewUrl: 'http://localhost:3000/runtimes',
    },

    {
      hideSideNav: true,
      hideFromNav: true,
      pathSegment: 'runtime',
      children: [
        {
          hideSideNav: true,
          hideFromNav: true,
          pathSegment: ':runtimeId',
          label: 'Runtimes',
          viewUrl: 'http://localhost:3000/runtime/:runtimeId',
        },
      ],
    },
  ],
};
export default navigation;
