import getPodsCounts from '../getPodsCounts';

describe('getPodsCounts', () => {
  it('counts running pod as healthy', () => {
    expect(getPodsCounts([{ status: 'RUNNING' }])).toEqual([1, 1]);
  });

  it('counts finished job as healthy', () => {
    expect(getPodsCounts([{ status: 'SUCCEEDED' }])).toEqual([1, 1]);
  });

  it('counts other statuses as unhealthy', () => {
    expect(
      getPodsCounts([
        { status: 'PENDING' },
        { status: 'FAILED' },
        { status: 'UNKNOWN' },
      ]),
    ).toEqual([3, 0]);
  });

  it('handles mixed healthy and unhealthy pods', () => {
    expect(
      getPodsCounts([
        { status: 'PENDING' },
        { status: 'FAILED' },
        { status: 'RUNNING' },
      ]),
    ).toEqual([3, 1]);
  });
});
