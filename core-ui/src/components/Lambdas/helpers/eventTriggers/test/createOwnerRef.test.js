import { createOwnerRef } from '../createOwnerRef';
import { FUNCTION_CUSTOM_RESOURCE } from '../../../constants';

describe('createOwnerRef', () => {
  test('should return proper object if lambda exists', () => {
    const result = createOwnerRef({
      name: 'pico',
      UID: '123-pico-bello',
    });
    expect(result).toEqual({
      apiVersion: FUNCTION_CUSTOM_RESOURCE.API_VERSION,
      kind: FUNCTION_CUSTOM_RESOURCE.KIND,
      name: 'pico',
      UID: '123-pico-bello',
    });
  });

  test("should return proper object if lambda doesn't exist", () => {
    const result = createOwnerRef();
    expect(result).toEqual({
      apiVersion: FUNCTION_CUSTOM_RESOURCE.API_VERSION,
      kind: FUNCTION_CUSTOM_RESOURCE.KIND,
      name: '',
      UID: '',
    });
  });
});
