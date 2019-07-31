import React from 'react';
import renderer from 'react-test-renderer';
import ModalWithForm from '../ModalWithForm.component';

describe('ModalWithForm', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <ModalWithForm
        title=""
        performRefetch={() => {}}
        sendNotification={() => {}}
        button={{ text: '' }}
      >
        <a></a>
      </ModalWithForm>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Renders child component', () => {
    const child = <span>test</span>;
    const component = renderer.create(
      <ModalWithForm
        title=""
        performRefetch={() => {}}
        sendNotification={() => {}}
        button={{ text: '' }}
      >
        {child}
      </ModalWithForm>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
