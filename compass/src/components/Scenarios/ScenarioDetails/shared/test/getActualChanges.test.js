import { getActualChanges } from './../getActualChanges';
import _ from 'lodash';

describe('getActualChanges', () => {
  const testCases = [
    {
      original: [{ id: 1 }, { id: 2 }],
      toAssign: [{ id: 1 }, { id: 2 }],
      toUnassign: [{ id: 3 }],
      actualToAssign: [],
      actualToDeasign: [],
    },
    {
      original: [{ id: 1 }, { id: 2 }],
      toAssign: [{ id: 3 }],
      toUnassign: [{ id: 2 }],
      actualToAssign: [{ id: 3 }],
      actualToDeasign: [{ id: 2 }],
    },
  ];

  for (const testCase of testCases) {
    it('Returns valid results', () => {
      const [actualToAssign, actualToDeassign] = getActualChanges(
        testCase.original,
        testCase.actualToAssign,
        testCase.actualToDeasign,
      );
      expect(_.isEqual(actualToAssign, testCase.actualToAssign)).toBe(true);
      expect(_.isEqual(actualToDeassign, testCase.actualToDeasign)).toBe(true);
    });
  }
});
