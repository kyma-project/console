//you can now use ES6 goodies here
Luigi.setConfig({
  navigation: {
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
        ],
      },
    ],
  },
  routing: {
    /**
     * Development:
     * For path routing, set to false
     * For hash routing, set to true
     */
    useHashRouting: true,
  },
});
