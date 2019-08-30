import React from 'react';
import renderer from 'react-test-renderer';
import ApiDetailsHeader from '../ApiDetailsHeader';

describe('ModalWithForm', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <ApiDetailsHeader
        apiType="openapi"
        api={{ name: 'testapi' }}
        application={{ name: 'abc' }}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
