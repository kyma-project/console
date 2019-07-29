import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import CreateRuntimeForm from '../CreateRuntimeForm.container';
import { MockedProvider } from 'react-apollo/test-utils';

import { mocks } from './mock';

describe('CreateRuntimeForm', () => {
  const emptyFn = () => {};
  const emptyRef = { current: null };

  it('Renders with minimal props', () => {
    const component = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreateRuntimeForm
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
  });
});
