const navigation = {
  nodes: () => [
    {
      pathSegment: 'home',
      label: 'Home',

      children: [
        {
          pathSegment: 'compass',
          label: 'Compass MF',
          viewUrl: 'http://localhost:3000/',
        },
        {
          pathSegment: 'runtimes',
          label: 'Runtimes',
          viewUrl: 'http://localhost:3000/runtimes',
        },
      ],
    },
  ],
};
export default navigation;
