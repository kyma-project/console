import settings from './settings';
import navigation from './navitagion';

Luigi.setConfig({
  navigation,
  routing: {
    /**
     * Development:
     * For path routing, set to false
     * For hash routing, set to true
     */
    useHashRouting: false,
  },
  settings,
});
