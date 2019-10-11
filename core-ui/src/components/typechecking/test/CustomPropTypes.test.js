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
  describe('ref', () => {
    it('Passes on empty ref', () => {
      assertPasses(CustomPropTypes.ref, {
        testprop: createRef(),
      });
    });

    it('Fails on string', () => {
      assertFails(CustomPropTypes.ref, {
        testprop: 'somestring',
      });
    });

    it('Fails on null if required', () => {
      assertFails(CustomPropTypes.ref.isRequired, {
        testprop: 'somestring',
      });
    });
  });
});
