import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { eventActivationMock } from 'components/Lambdas/helpers/testing';
import { EVENT_TRIGGERS_PANEL } from 'shared/constants';

import CreateEventTriggerModal from '../CreateEventTriggerModal';

jest.mock('@luigi-project/client', () => {
  return {
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

describe('CreateEventTriggerModal + CreateEventTriggerForm', () => {
  const events = eventActivationMock.events.map(event => ({
    ...event,
    source: eventActivationMock.sourceId,
  }));

  it('should disable open button if there are not available events', async () => {
    const { getByText } = render(
      <CreateEventTriggerModal availableEvents={[]} />,
    );

    const button = getByText(EVENT_TRIGGERS_PANEL.ADD_MODAL.OPEN_BUTTON.TEXT);
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('should not disable button if there are available events', async () => {
    const { getByText } = render(
      <CreateEventTriggerModal availableEvents={events} />,
    );

    const button = getByText(EVENT_TRIGGERS_PANEL.ADD_MODAL.OPEN_BUTTON.TEXT);
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('should show modal after click action button', async () => {
    const { getByText, getByRole } = render(
      <CreateEventTriggerModal availableEvents={events} />,
    );

    const button = getByText(EVENT_TRIGGERS_PANEL.ADD_MODAL.OPEN_BUTTON.TEXT);
    fireEvent.click(button);
    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it("should show tooltip on modal's create button if any events are checked", async () => {
    const { getByText } = render(
      <CreateEventTriggerModal availableEvents={events} />,
    );

    const button = getByText(EVENT_TRIGGERS_PANEL.ADD_MODAL.OPEN_BUTTON.TEXT);
    fireEvent.click(button);

    const addButton = getByText(
      EVENT_TRIGGERS_PANEL.ADD_MODAL.CONFIRM_BUTTON.TEXT,
    );
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();
  });

  it("should not show tooltip on modal's create button if at least one of events is checked", async () => {
    const { getByText } = render(
      <CreateEventTriggerModal availableEvents={events} />,
    );

    const button = getByText(EVENT_TRIGGERS_PANEL.ADD_MODAL.OPEN_BUTTON.TEXT);
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    fireEvent.click(button);

    const checkboxes = document.querySelectorAll('input[type=checkbox]');
    expect(checkboxes.length).toBeGreaterThan(0);

    fireEvent.click(checkboxes[0]);

    const addButton = getByText(
      EVENT_TRIGGERS_PANEL.ADD_MODAL.CONFIRM_BUTTON.TEXT,
    );
    expect(addButton).toBeInTheDocument();
    expect(addButton).not.toBeDisabled();
  });
});
