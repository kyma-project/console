import React from 'react';
import renderer from 'react-test-renderer';

import RegisterRuntimeForm from '../RegisterRuntimeForm.container';
import { MockedProvider } from 'react-apollo/test-utils';

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

    expect(console.warn.mock.calls[0][0]).toMatchSnapshot();
  });
});
