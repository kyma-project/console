export const communication = {
  customMessagesListeners: {
    'console.toggleExperimental': () => {
      Luigi.configChanged('navigation.nodes');
    }
  }
};
