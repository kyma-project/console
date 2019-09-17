import { queryTransformService } from './../queryTransformService';

describe('QueryTransformService', () => {
  describe('toQuery', () => {
    const { toQuery } = queryTransformService();

    it('Converts with labels and searchPhrase', () => {
      const labels = ['a="b"', 'c="d"'];
      const searchPhrase = 'search phrase';

      const result = toQuery(labels, searchPhrase);

      expect(result).toEqual('{a="b",c="d"} search phrase');
    });

    it('Converts with no labels and searchPhrase', () => {
      const labels = [];
      const searchPhrase = 'search phrase';

      const result = toQuery(labels, searchPhrase);

      expect(result).toEqual('{} search phrase');
    });

    it('Converts with labels and no searchPhrase', () => {
      const labels = ['a="b"', 'c="d"'];
      const searchPhrase = '';

      const result = toQuery(labels, searchPhrase);

      expect(result).toEqual('{a="b",c="d"} ');
    });
  });

  describe('parseQuery', () => {
    const { parseQuery } = queryTransformService();

    it('Converts from query with labels and search phrase', () => {
      const query = '{a="b",c="d"} search phrase';

      const result = parseQuery(query);

      expect(result.labels).toEqual(['a="b"', 'c="d"']);
      expect(result.searchPhrase).toEqual('search phrase');
    });

    it('Converts from query with labels and no search phrase', () => {
      const query = '{a="b",c="d"}';

      const result = parseQuery(query);

      expect(result.labels).toEqual(['a="b"', 'c="d"']);
      expect(result.searchPhrase).toEqual('');
    });

    it('Converts from query with no labels and search phrase', () => {
      const query = 'search phrase';

      const result = parseQuery(query);

      expect(result.labels).toEqual([]);
      expect(result.searchPhrase).toEqual('search phrase');
    });

    it('Converts empty input', () => {
      const query = '';

      const result = parseQuery(query);

      expect(result.labels).toEqual([]);
      expect(result.searchPhrase).toEqual('');
    });
  });
});
