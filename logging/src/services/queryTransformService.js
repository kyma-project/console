import createUseContext from 'constate';

// query: `{...labels} searchPhrase?`
const useQueryTransformService = createUseContext(() => {
  const tryGetSearchPhrase = query => {
    // const splitQuery = query.split(' ');
    // const lastItem = splitQuery[splitQuery.length - 1];

    // // check if query contains searchPhrase
    // if (lastItem && !lastItem.includes('}')) {
    //   return lastItem;
    // }
    // return null;

    const index = query.indexOf('}');
    if (index === -1) {
      return null;
    } else {
      return query.substring(index + 1).trim();
    }
  };

  const parseQuery = query => {
    const searchPhrase = tryGetSearchPhrase(query);
    if (searchPhrase) {
      // extract labels part
      const queryLabels = query.substring(
        0,
        query.length - searchPhrase.length,
      );
      const labels = queryLabels
        .replace(/{|}/g, '')
        .trim()
        .split(',');
      return {
        labels,
        searchPhrase,
      };
    } else {
      return {
        labels: query.replace(/{|}/g, '').split(','),
        searchPhrase: '',
      };
    }
  };

  const toQuery = (labels, searchPhrase) => {
    const queryLabels = labels.join(',');
    return `{${queryLabels}} ${searchPhrase.trim()}`;
  };

  return {
    parseQuery,
    toQuery,
  };
});

const { Provider, Context } = useQueryTransformService;
export {
  Provider as QueryTransformServiceProvider,
  Context as QueryTransformServiceContext,
};
