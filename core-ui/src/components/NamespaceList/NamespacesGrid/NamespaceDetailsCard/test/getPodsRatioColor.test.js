import { getPodsRatioColor } from './../NamespaceDetailsCard';

describe('getPodsRatioColor', () => {
  it('Chooses valid color for number of pods', () => {
    const testCases = [
      {
        podsCount: 10,
        healthyCount: 10,
        color: '#107e3e',
      },
      {
        podsCount: 10,
        healthyCount: 9,
        color: '#e9730c',
      },
      {
        podsCount: 10,
        healthyCount: 8,
        color: '#bb0000',
      },
      {
        podsCount: 0,
        healthyCount: 0,
        color: '#107e3e',
      },
      {
        podsCount: 1,
        healthyCount: 0,
        color: '#bb0000',
      },
      {
        podsCount: 2,
        healthyCount: 1,
        color: '#bb0000',
      },
    ];

    for (const { podsCount, healthyCount, color } of testCases) {
      const ratioColor = getPodsRatioColor(healthyCount, podsCount);
      expect(ratioColor).toEqual(color);
    }
  });
});
