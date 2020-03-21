import { createOwnerRef } from '../createOwnerRef';
import { TRIGGER_SUBSCRIBER } from '../../../constants';

describe('createOwnerRef', () => {
  test('should return proper object if lambda exists', () => {
    const result = createOwnerRef({
      name: 'pico',
      UID: '123-pico-bello',
    });
    expect(result).toEqual({
      apiVersion: TRIGGER_SUBSCRIBER.SERVING_API_VERSION,
      kind: TRIGGER_SUBSCRIBER.SERVING_SERVICE,
      name: 'pico',
      UID: '123-pico-bello',
    });
  });

  test("should return proper object if lambda doesn't exist", () => {
    const result = createOwnerRef();
    expect(result).toEqual({
      apiVersion: TRIGGER_SUBSCRIBER.SERVING_API_VERSION,
      kind: TRIGGER_SUBSCRIBER.SERVING_SERVICE,
      name: '',
      UID: '',
    });
  });
});
