import settings from './settings';
import navigation from './navigation';
import createAuth from './auth';

(async () => {
  Luigi.setConfig({
    navigation,
    auth: await createAuth(),
    routing: {
      useHashRouting: false,
    },
    settings,
  });
})();
