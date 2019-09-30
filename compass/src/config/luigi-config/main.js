import settings from './settings';
import navigation from './navigation';
import auth from './auth';

Luigi.setConfig({
  navigation,
  auth,
  routing: {
    useHashRouting: false,
  },
  settings,
});
