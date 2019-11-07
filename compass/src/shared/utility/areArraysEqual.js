import _ from 'lodash';

// compare order invariant
export const areArraysEqual = (a, b) => _.isEqual(_.sortBy(a), _.sortBy(b));
