import CustomPropTypes from '../CustomPropTypes';
import React from 'react';
import PropTypes from 'prop-types';

// secret is required to call validators directly
import secret from 'prop-types/lib/ReactPropTypesSecret';

import { createRef } from 'react';

function assertPasses(validator, props) {
  expect(
    validator(props, 'testprop', 'testcomponent', 'prop', '', secret),
  ).toBe(null);
}

function assertFails(validator, props) {
  expect(
    validator(props, 'testprop', 'testcomponent', 'prop', '', secret),
  ).toBeInstanceOf(Error);
}

describe('CustomPropTypes', () => {
  describe('elementRef', () => {
    it('Passes on empty ref', () => {
      assertPasses(CustomPropTypes.elementRef, {
        testprop: createRef(),
      });
    });

    it('Passes on element ref', () => {
      const ref = createRef();
      ref.current = <div />;
      assertPasses(CustomPropTypes.elementRef, {
        testprop: ref,
      });
    });

    it('Fails on non element ref', () => {
      const ref = createRef();
      ref.current = 'string';
      assertFails(CustomPropTypes.elementRef, {
        testprop: ref,
      });
    });

    it('Fails on string', () => {
      assertFails(CustomPropTypes.elementRef, {
        testprop: 'somestring',
      });
    });

    it('Fails on null if required', () => {
      assertFails(CustomPropTypes.elementRef.isRequired, {
        testprop: 'somestring',
      });
    });
  });
});
