const indexTabNamePairs = [[0, 'addons'], [1, 'services']];

const DEFAULT_TAB_NAME = 'addons';
const DEFAULT_TAB_INDEX = 0;

export function convertIndexToTabName(tabIndex = DEFAULT_TAB_INDEX) {
  return indexTabNamePairs[tabIndex][1];
}

export function convertTabNameToIndex(tabName = DEFAULT_TAB_NAME) {
  return indexTabNamePairs.find(
    indexTabNamePair => indexTabNamePair[1] === tabName,
  )[0];
}

export const instancesTabUtils = {
  convertTabNameToIndex,
  convertIndexToTabName,
};
