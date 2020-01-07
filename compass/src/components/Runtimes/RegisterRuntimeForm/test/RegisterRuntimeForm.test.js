import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/react-testing';

import RegisterRuntimeForm from '../RegisterRuntimeForm.container';

describe('RegisterRuntimeForm', () => {
  // for "Warning: componentWillReceiveProps has been renamed"
  console.warn = jest.fn();

  const emptyFn = () => {};
  const emptyRef = { current: null };

  it('Renders with minimal props', () => {
    const component = renderer.create(
      <MockedProvider addTypename={false}>
        <RegisterRuntimeForm
          formElementRef={emptyRef}
          isValid={false}
          onChange={emptyFn}
          onCompleted={emptyFn}
          onError={emptyFn}
        />
      </MockedProvider>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    expect(console.warn).not.toHaveBeenCalled();
  });
});
