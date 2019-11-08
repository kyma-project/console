import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import LambdaDetailsHeader from '../LambdaDetailsHeader';

describe('LambdaDetailsHeader UI', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <LambdaDetailsHeader
        lambda={{ name: 'testlambda', namepace: 'testnamespace' }}
        handleUpdate={() => {}}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Handles save button click', () => {
    const handleUpdate = jest.fn();

    const component = mount(
      <LambdaDetailsHeader
        lambda={{ name: 'testlambda', namepace: 'testnamespace' }}
        handleUpdate={handleUpdate}
      />,
    );
    const deleteButton = component.find(
      '[data-test-id="lambda-save-button"] button',
    );
    deleteButton.simulate('click');

    expect(handleUpdate).toHaveBeenCalledTimes(1);
  });
});
