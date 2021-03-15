import React from 'react';

import { Button } from 'fundamental-react';
import { ModalWithForm } from 'react-shared';

import CreateEventSubscriptionForm from './CreateEventSubscriptionForm';

import { EVENT_TRIGGERS_PANEL } from '../../constants';

export default function CreateEventSubscriptionModal({
  isLambda = false,
  onSubmit,
}) {
  const button = (
    <Button glyph="add" option="light">
      {EVENT_TRIGGERS_PANEL.ADD_MODAL.OPEN_BUTTON.TEXT}
    </Button>
  );

  return (
    <ModalWithForm
      title={EVENT_TRIGGERS_PANEL.ADD_MODAL.TITLE}
      modalOpeningComponent={button}
      confirmText={EVENT_TRIGGERS_PANEL.ADD_MODAL.CONFIRM_BUTTON.TEXT}
      invalidPopupMessage={
        EVENT_TRIGGERS_PANEL.ADD_MODAL.CONFIRM_BUTTON.INVALID_POPUP_MESSAGE
      }
      id="add-event-trigger-modal"
      className="fd-modal--xl-size"
      renderForm={props => (
        <CreateEventSubscriptionForm
          {...props}
          isLambda={isLambda}
          onSubmit={onSubmit}
        />
      )}
    />
  );
}
