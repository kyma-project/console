import settings from './settings';
import navigation from './navitagion';

Luigi.setConfig({
  navigation,
  routing: {
    useHashRouting: false,
  },
  settings,
});
