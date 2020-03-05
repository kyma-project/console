export const communication = {
  customMessagesListeners: {
    'console.refreshNavigation': () => {
      Luigi.configChanged('navigation.nodes');
    }
  }
};


