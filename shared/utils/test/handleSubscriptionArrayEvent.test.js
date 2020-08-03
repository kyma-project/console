import { handleSubscriptionArrayEvent } from '../handleSubscriptionArrayEvent';

describe('handleSubscriptionArrayEvent', () => {
  const resource = [{ name: 'a' }, { name: 'b' }];
  const setResource = jest.fn();

  beforeEach(setResource.mockReset);

  it('handles ADD', () => {
    handleSubscriptionArrayEvent(resource, setResource, 'ADD', { name: 'c' });

    expect(setResource).toHaveBeenCalledWith([...resource, { name: 'c' }]);
  });

  it('handles ADD - throws on duplicated name', () => {
    const act = () =>
      handleSubscriptionArrayEvent(resource, setResource, 'ADD', { name: 'a' });

    expect(act).toThrowError('Duplicate name: a');
  });

  it('handles UPDATE', () => {
    const updated = {
      name: 'a',
      value: 'c',
    };
    handleSubscriptionArrayEvent(resource, setResource, 'UPDATE', updated);

    expect(setResource).toHaveBeenCalledWith([updated, { name: 'b' }]);
  });

  it('handles DELETE', () => {
    handleSubscriptionArrayEvent(resource, setResource, 'DELETE', {
      name: 'b',
    });

    expect(setResource).toHaveBeenCalledWith([{ name: 'a' }]);
  });

  it('handles DELETE - ignores when resource is not found', () => {
    handleSubscriptionArrayEvent(resource, setResource, 'DELETE', {
      name: 'x',
    });

    expect(setResource).toHaveBeenCalledWith(resource);
  });

  it('ignores invalid event type', () => {
    handleSubscriptionArrayEvent(resource, setResource, 'invalid', null);

    expect(setResource).not.toHaveBeenCalled();
  });
});
