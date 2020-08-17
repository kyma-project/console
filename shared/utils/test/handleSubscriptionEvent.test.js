import { handleSubscriptionEvent } from '../handleSubscriptionEvent';

describe('handleSubscriptionEvent', () => {
  const setResource = jest.fn();
  const filter = name => r => r.name === name;

  beforeEach(setResource.mockReset);

  test.each([['ADD'], ['UPDATE']])('handles %p', type => {
    const changedResource = { name: 'a' };
    handleSubscriptionEvent(type, setResource, changedResource, filter('a'));

    expect(setResource).toHaveBeenCalledWith(changedResource);
  });

  it('handles DELETE', () => {
    const changedResource = { name: 'a' };
    handleSubscriptionEvent(
      'DELETE',
      setResource,
      changedResource,
      filter('a'),
    );

    expect(setResource).toHaveBeenCalledWith(null);
  });

  it('ignores event for non-matched resource', () => {
    const changedResource = { name: 'a' };
    handleSubscriptionEvent(
      'DELETE',
      setResource,
      changedResource,
      filter('b'),
    );

    expect(setResource).not.toHaveBeenCalled();
  });

  it('ignores invalid event type', () => {
    handleSubscriptionEvent('invalid', setResource, {}, () => true);

    expect(setResource).not.toHaveBeenCalled();
  });
});
