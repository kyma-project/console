import { getActualChangesBy } from '../getActualChangesBy';
import _ from 'lodash';

describe('getActualChangesBy', () => {
  const testCases = [
    {
      original: [{ id: 1 }, { id: 2 }],
      toAdd: [{ id: 1 }, { id: 2 }],
      toRemove: [{ id: 3 }],
      actualToAdd: [],
      actualToRemove: [],
    },
    {
      original: [{ id: 1 }, { id: 2 }],
      toAdd: [{ id: 3 }],
      toRemove: [{ id: 2 }],
      actualToAdd: [{ id: 3 }],
      actualToRemove: [{ id: 2 }],
    },
  ];

  for (const testCase of testCases) {
    it('Returns valid results', () => {
      const [actualToAdd, actualToRemove] = getActualChangesBy(
        'id',
        testCase.original,
        testCase.actualToAdd,
        testCase.actualToRemove,
      );
      expect(_.isEqual(actualToAdd, testCase.actualToAdd)).toBe(true);
      expect(_.isEqual(actualToRemove, testCase.actualToRemove)).toBe(true);
    });
  }
});
