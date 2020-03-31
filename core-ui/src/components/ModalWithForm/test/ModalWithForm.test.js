import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ModalWithForm from '../ModalWithForm';

jest.mock('@kyma-project/luigi-client', () => {
  return {
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

describe('ModalWithForm', () => {
  const buttonText = 'Open';

  it('Renders title', () => {
    const title = 'Modal';
    const { getByText } = render(
      <ModalWithForm
        title={title}
        performRefetch={() => {}}
        sendNotification={() => {}}
        button={{ text: buttonText }}
        renderForm={() => null}
      />,
    );

    const button = getByText(buttonText);
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    expect(getByText(title)).toBeInTheDocument();
  });

  it('Renders form component', () => {
    const text = 'foo bar';
    const { getByText } = render(
      <ModalWithForm
        title=""
        performRefetch={() => {}}
        sendNotification={() => {}}
        button={{ text: buttonText }}
        renderForm={() => <span>{text}</span>}
      />,
    );

    const button = getByText(buttonText);
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    expect(getByText(text)).toBeInTheDocument();
  });

  it('should show tooltip on hover confirm button if invalidPopupMessage prop is passes', () => {
    const text = 'foo bar';
    const message = 'popup message';
    const confirmText = 'Create';

    const { getByText } = render(
      <ModalWithForm
        title=""
        performRefetch={() => {}}
        sendNotification={() => {}}
        button={{ text: buttonText }}
        renderForm={() => <span>{text}</span>}
        invalidPopupMessage={message}
        confirmText={confirmText}
      />,
    );

    const button = getByText(buttonText);
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    const confirmButton = getByText(confirmText);
    expect(confirmButton).toBeInTheDocument();

    fireEvent.mouseEnter(confirmButton);
    const tooltip = document.querySelector(
      `[data-original-title="${message}"]`,
    );
    expect(tooltip).toBeInTheDocument();
  });
});
