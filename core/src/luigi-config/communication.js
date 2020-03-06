import { relogin, getToken } from './navigation/navigation-helpers';

export const communication = {
  customMessagesListeners: {
    'console.refreshNavigation': () => {
      const token = getToken()
      if(token){
        Luigi.configChanged('navigation.nodes');
      }
      else {
        relogin()
      }
    }
  }
};


