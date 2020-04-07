import React from 'react';
import renderer from 'react-test-renderer';
import ModalWithForm from '../ModalWithForm';

describe('ModalWithForm', () => {
  it('Renders child component', () => {
    const child = <span>test</span>;
    const component = renderer.create(
      <ModalWithForm
        title=""
        performRefetch={() => {}}
        sendNotification={() => {}}
        confirmText="Create"
        button={{ text: '' }}
        renderForm={() => child}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
