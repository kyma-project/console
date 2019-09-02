import { CustomPropTypes } from './CustomPropTypes';
import { createRef } from 'react';

describe('CustomPropTypes', () => {
  describe('elementRef', () => {
    it('Returns null for a valid ref', () => {
      const props = {
        testprop: createRef(null),
      };

      expect(
        CustomPropTypes.elementRef(props, 'testprop', 'testcomponent'),
      ).toBe(null);
    });

    it('Returns an error for string', () => {
      const props = {
        testprop: 'somestring',
      };

      expect(
        CustomPropTypes.elementRef(props, 'testprop', 'testcomponent'),
      ).toMatchSnapshot();
    });

    it('Returns an error for null', () => {
      const props = {
        testprop: 'somestring',
      };

      expect(
        CustomPropTypes.elementRef(props, 'testprop', 'testcomponent'),
      ).toMatchSnapshot();
    });
  });

  describe('oneOfProps', () => {
    const allProps = ['a', 'b', 'c'];

    it('Returns no error if one of properties is provided', () => {
      expect(
        CustomPropTypes.oneOfProps({ a: 123 }, 'componentA', allProps),
      ).toBe(undefined);
    });

    it('Returns no error all props are provided', () => {
      expect(
        CustomPropTypes.oneOfProps(
          { a: 123, b: 55, c: 6436 },
          'componentA',
          allProps,
        ),
      ).toBe(undefined);
    });

    it('Returns error no prop is provided', () => {
      expect(
        CustomPropTypes.oneOfProps({}, 'componentA', allProps),
      ).toMatchSnapshot();
    });
  });
});
