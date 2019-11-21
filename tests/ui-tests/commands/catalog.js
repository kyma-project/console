import config from '../config';

module.exports = {
  prepareSelector: name => `[${config.catalogTestingAtribute}="${name}"]`,
};
