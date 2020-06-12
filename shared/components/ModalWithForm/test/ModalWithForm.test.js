import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ModalWithForm } from '../ModalWithForm';

describe('ModalWithForm', () => {
  it('Renders child component', () => {
    const child = <span>test</span>;
    const { getByText, queryByText } = render(
      <div>
        <ModalWithForm
          title=""
          performRefetch={() => {}}
          sendNotification={() => {}}
          confirmText="Create"
          button={{ text: 'Open' }}
          renderForm={() => child}
        />
      </div>,
    );

    fireEvent.click(getByText('Open'));

    expect(queryByText('test')).toBeInTheDocument();
  });
});
