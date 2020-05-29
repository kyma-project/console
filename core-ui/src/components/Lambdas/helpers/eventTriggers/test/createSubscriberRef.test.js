import { createSubscriberRef } from '../createSubscriberRef';
import { TRIGGER_SUBSCRIBER } from '../../../constants';

describe('createSubscriberRef', () => {
  test('should return proper object if lambda exists', () => {
    const result = createSubscriberRef({
      name: 'pico',
      namespace: 'bello',
    });
    expect(result).toEqual({
      ref: {
        apiVersion: TRIGGER_SUBSCRIBER.API_VERSION,
        kind: TRIGGER_SUBSCRIBER.KIND,
        name: 'pico',
        namespace: 'bello',
      },
    });
  });

  test("should return proper object if lambda doesn't exist", () => {
    const result = createSubscriberRef();
    expect(result).toEqual({
      ref: {
        apiVersion: TRIGGER_SUBSCRIBER.API_VERSION,
        kind: TRIGGER_SUBSCRIBER.KIND,
        name: '',
        namespace: '',
      },
    });
  });
});
