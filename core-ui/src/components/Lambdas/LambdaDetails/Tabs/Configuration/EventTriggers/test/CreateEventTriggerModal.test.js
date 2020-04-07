import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import {
  lambdaMock,
  eventActivationMock,
} from 'components/Lambdas/helpers/testing';
import { EVENT_TRIGGERS_PANEL } from 'components/Lambdas/constants';

import CreateEventTriggerModal from '../CreateEventTriggerModal';

jest.mock('@kyma-project/luigi-client', () => {
  return {
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

describe('CreateEventTriggerModal + CreateEventTriggerForm', () => {
  const events = [
    eventActivationMock.events.map(event => ({
      ...event,
      source: eventActivationMock.sourceId,
    })),
  ];

  it('should show tooltip on hover button if there are not available events', async () => {
    const { container, getByText } = render(
      <CreateEventTriggerModal lambda={lambdaMock} availableEvents={[]} />,
    );

    const button = getByText(EVENT_TRIGGERS_PANEL.ADD_MODAL.OPEN_BUTTON.TEXT);
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    fireEvent.mouseEnter(button);
    const tooltip = container.querySelector(
      `[data-original-title="${EVENT_TRIGGERS_PANEL.ADD_MODAL.OPEN_BUTTON.NOT_ENTRIES_POPUP_MESSAGE}"]`,
    );
    expect(tooltip).toBeInTheDocument();
  });

  it('should not show tooltip on hover button if there are available events', async () => {
    const { container, getByText } = render(
      <CreateEventTriggerModal lambda={lambdaMock} availableEvents={events} />,
    );

    const button = getByText(EVENT_TRIGGERS_PANEL.ADD_MODAL.OPEN_BUTTON.TEXT);
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();

    fireEvent.mouseEnter(button);
    const tooltip = container.querySelector(
      `[data-original-title="${EVENT_TRIGGERS_PANEL.ADD_MODAL.OPEN_BUTTON.NOT_ENTRIES_POPUP_MESSAGE}"]`,
    );
    expect(tooltip).not.toBeInTheDocument();
  });

  it('should show modal after click action button', async () => {
    const { getByText, getByRole } = render(
      <CreateEventTriggerModal lambda={lambdaMock} availableEvents={events} />,
    );

    const button = getByText(EVENT_TRIGGERS_PANEL.ADD_MODAL.OPEN_BUTTON.TEXT);
    fireEvent.click(button);
    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it("should show tooltip on modal's create button if any events are checked", async () => {
    const { getByText } = render(
      <CreateEventTriggerModal lambda={lambdaMock} availableEvents={events} />,
    );

    const button = getByText(EVENT_TRIGGERS_PANEL.ADD_MODAL.OPEN_BUTTON.TEXT);
    fireEvent.click(button);

    const tooltip = document.querySelector(
      `[data-original-title="${EVENT_TRIGGERS_PANEL.ADD_MODAL.CONFIRM_BUTTON.INVALID_POPUP_MESSAGE}"]`,
    );
    expect(tooltip).toBeInTheDocument();

    const addButton = getByText(
      EVENT_TRIGGERS_PANEL.ADD_MODAL.CONFIRM_BUTTON.TEXT,
    );
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();
  });

  it("should not show tooltip on modal's create button if at least one of events is checked", async () => {
    const { getByText } = render(
      <CreateEventTriggerModal lambda={lambdaMock} availableEvents={events} />,
    );

    const button = getByText(EVENT_TRIGGERS_PANEL.ADD_MODAL.OPEN_BUTTON.TEXT);
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    fireEvent.click(button);

    const checkboxes = document.querySelectorAll('input[type=checkbox]');
    expect(checkboxes.length).toBeGreaterThan(0);

    fireEvent.click(checkboxes[0]);
    const tooltip = document.querySelector(
      `[data-original-title="${EVENT_TRIGGERS_PANEL.ADD_MODAL.CONFIRM_BUTTON.INVALID_POPUP_MESSAGE}"]`,
    );
    expect(tooltip).not.toBeInTheDocument();

    const addButton = getByText(
      EVENT_TRIGGERS_PANEL.ADD_MODAL.CONFIRM_BUTTON.TEXT,
    );
    expect(addButton).toBeInTheDocument();
    expect(addButton).not.toBeDisabled();
  });
});
