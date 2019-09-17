import createUseContext from 'constate';

export const queryTransformService = () => {
  const splitQueryLabels = queryLabels => {
    return queryLabels
      .replace(/{|}/g, '')
      .split(',')
      .map(e => e.trim())
      .filter(e => e.length);
  };

  const tryGetSearchPhrase = query => {
    // const splitQuery = query.split(' ');
    // const lastItem = splitQuery[splitQuery.length - 1];

    // // check if query contains searchPhrase
    // if (lastItem && !lastItem.includes('}')) {
    //   return lastItem;
    // }
    // return null;

    const index = query.lastIndexOf('}');
    if (index === -1) {
      return query;
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
      return {
        labels: splitQueryLabels(queryLabels),
        searchPhrase,
      };
    } else {
      return {
        labels: splitQueryLabels(query),
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
};

const { Provider, Context } = createUseContext(queryTransformService);
export {
  Provider as QueryTransformServiceProvider,
  Context as QueryTransformServiceContext,
};
