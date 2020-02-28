import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/react-testing';

import { lambda } from './gqlMocks';
import ServiceBindingsWrapper from '../ServiceBindingsWrapper';

describe('ServiceBindingsWrapper', () => {
  it('Render with minimal props', () => {
    const component = renderer.create(
      <MockedProvider>
        <ServiceBindingsWrapper lambda={lambda} />
      </MockedProvider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
