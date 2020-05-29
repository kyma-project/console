import { createSubscriberRef } from '../createSubscriberRef';
import { CONFIG } from '../../../config';

describe('createSubscriberRef', () => {
  test('should return proper object if lambda exists', () => {
    const result = createSubscriberRef({
      name: 'pico',
      namespace: 'bello',
    });
    expect(result).toEqual({
      ref: {
        apiVersion: CONFIG.triggerSubscriber.apiVersion,
        kind: CONFIG.triggerSubscriber.kind,
        name: 'pico',
        namespace: 'bello',
      },
    });
  });

  test("should return proper object if lambda doesn't exist", () => {
    const result = createSubscriberRef();
    expect(result).toEqual({
      ref: {
        apiVersion: CONFIG.triggerSubscriber.apiVersion,
        kind: CONFIG.triggerSubscriber.kind,
        name: '',
        namespace: '',
      },
    });
  });
});
