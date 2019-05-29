// this is the primary export for Blocks
// All components are exported from lib/index.js

import { media, sizes } from './style-utils.js';
import { instanceStatusColor } from './instance-status-color';
import { randomNamesGenerator } from './random-names-generator';

module.exports = {
  instanceStatusColor,
  media,
  sizes,
  randomNamesGenerator,
};
