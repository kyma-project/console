import React from 'react';
import renderer from 'react-test-renderer';
import ModalWithForm from '../ModalWithForm';

describe('ModalWithForm', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <ModalWithForm
        title=""
        performRefetch={() => {}}
        sendNotification={() => {}}
        button={{ text: '' }}
        renderForm={() => <span></span>}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Renders child component', () => {
    const component = renderer.create(
      <ModalWithForm
        title=""
        performRefetch={() => {}}
        sendNotification={() => {}}
        button={{ text: '' }}
        renderForm={() => <span>test</span>}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
