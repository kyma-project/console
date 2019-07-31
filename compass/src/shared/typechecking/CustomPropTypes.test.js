import { CustomPropTypes } from './CustomPropTypes';
import { createRef } from 'react';

describe('CustomPropTypes', () => {
  it('Returns null for a valid ref', () => {
    const props = {
      testprop: createRef(null),
    };

    expect(CustomPropTypes.elementRef(props, 'testprop', 'testcomponent')).toBe(
      null,
    );
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
