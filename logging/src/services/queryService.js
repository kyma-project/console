import createUseContext from 'constate';

export const useQueryService = createUseContext(() => {
  const parseQuery = query => {
    const labels = query.replace(/{|}/g, '').split(',');
    const searchPhrase = labels[labels.length];
    if (searchPhrase && searchPhrase.includes('=')) {
    }
  };

  const toQuery = (labels, readonlyLabels, searchPhrase) => {
    const allLabels = Array.from(new Set([...readonlyLabels, ...labels]));
    const query = allLabels.join(',');
    return `{${query}} ${searchPhrase}`;
  };

  return {
    parseQuery,
    toQuery,
  };
});
