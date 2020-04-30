import React, { useState } from 'react';

import { Button } from 'fundamental-react';

import ModalWithForm from 'components/ModalWithForm/ModalWithForm';

import { ENVIRONMENT_VARIABLES_PANEL } from 'components/Lambdas/constants';

import EditVariablesForm from './EditVariablesForm';

export default function EditVariablesModal({
  lambda,
  customVariables,
  customValueFromVariables,
  injectedVariables,
}) {
  const [invalidModalPopupMessage, setInvalidModalPopupMessage] = useState('');

  const modalOpeningComponent = (
    <Button glyph="edit" option="light">
      {ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT}
    </Button>
  );

  return (
    <ModalWithForm
      title={ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.TITLE}
      modalOpeningComponent={modalOpeningComponent}
      confirmText={ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.CONFIRM_BUTTON.TEXT}
      invalidPopupMessage={invalidModalPopupMessage}
      id="add-lambda-variables-modal"
      className="fd-modal--xl-size lambda-variables-modal"
      renderForm={props => (
        <EditVariablesForm
          {...props}
          lambda={lambda}
          customVariables={customVariables}
          customValueFromVariables={customValueFromVariables}
          injectedVariables={injectedVariables}
          setInvalidModalPopupMessage={setInvalidModalPopupMessage}
        />
      )}
    />
  );
}
