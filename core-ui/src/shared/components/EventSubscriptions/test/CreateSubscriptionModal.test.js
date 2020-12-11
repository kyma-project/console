import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CreateSubscriptionModal from '../CreateSubscriptionModal';
import { EVENT_SUBSCRIPTION_PANEL } from 'shared/constants';
import { lambdaMock } from 'components/Lambdas/helpers/testing/mockData';
import { eventActivationMock } from 'components/Lambdas/helpers/testing';
import { createLambdaRef } from '../../../../components/Lambdas/LambdaDetails/Tabs/Configuration/EventTriggers/helpers';

describe('CreateSubscriptionModal', () => {
  const events = eventActivationMock.events.map(event => ({
    ...event,
    source: eventActivationMock.sourceId,
  }));

  it('should show modal after click action button', async () => {
    const { getByText, getByRole } = render(
      <CreateSubscriptionModal
        events={[events]}
        owner={lambdaMock}
        namespaceId={'test'}
        createResourceRef={createLambdaRef}
      />,
    );

    const button = getByText(
      EVENT_SUBSCRIPTION_PANEL.ADD_MODAL.OPEN_BUTTON.TEXT,
    );
    fireEvent.click(button);
    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it("should show tooltip on modal's create button if any events are checked", async () => {
    const { getByText } = render(
      <CreateSubscriptionModal
        events={[events]}
        owner={lambdaMock}
        namespaceId={'test'}
        createResourceRef={createLambdaRef}
      />,
    );

    const button = getByText(
      EVENT_SUBSCRIPTION_PANEL.ADD_MODAL.OPEN_BUTTON.TEXT,
    );
    fireEvent.click(button);

    const addButton = getByText(
      EVENT_SUBSCRIPTION_PANEL.ADD_MODAL.CONFIRM_BUTTON.TEXT,
    );
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();
  });

  it("should not show tooltip on modal's create button if at least one of events is checked", async () => {
    const { getByText } = render(
      <CreateSubscriptionModal
        events={[events]}
        owner={lambdaMock}
        namespaceId={'test'}
        createResourceRef={createLambdaRef}
      />,
    );

    const button = getByText(
      EVENT_SUBSCRIPTION_PANEL.ADD_MODAL.OPEN_BUTTON.TEXT,
    );
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    fireEvent.click(button);

    const checkboxes = document.querySelectorAll('input[type=checkbox]');
    expect(checkboxes.length).toBeGreaterThan(0);

    fireEvent.click(checkboxes[0]);

    const addButton = getByText(
      EVENT_SUBSCRIPTION_PANEL.ADD_MODAL.CONFIRM_BUTTON.TEXT,
    );
    expect(addButton).toBeInTheDocument();
    expect(addButton).not.toBeDisabled();
  });
});
