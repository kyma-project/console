import React, { useState, useEffect } from 'react';

import { Icon } from 'fundamental-react';
import { Tooltip } from 'react-shared';

import ModalWithForm from 'components/ModalWithForm/ModalWithForm';
import { LabelsInput } from 'components/Lambdas/components';

import { useUpdateLambda, UPDATE_TYPE } from 'components/Lambdas/gql/hooks';

import { LAMBDA_DETAILS } from 'components/Lambdas/constants';

function EditLambdaLabelsForm({
  lambda,
  formElementRef,
  setValidity = () => void 0,
}) {
  const updateLambda = useUpdateLambda({
    lambda,
    type: UPDATE_TYPE.GENERAL_CONFIGURATION,
  });
  const [labels, setLabels] = useState(lambda.labels);

  useEffect(() => {
    setValidity(true);
  }, [setValidity]);

  function updateLabels(newLabels) {
    setLabels(newLabels);
  }

  async function handleSubmit() {
    updateLambda({
      labels,
    });
  }

  return (
    <form
      ref={formElementRef}
      onSubmit={handleSubmit}
      className="lambda-details-header__edit-labels-form"
    >
      <LabelsInput labels={labels} onChange={updateLabels} />
    </form>
  );
}

export default function EditLambdaLabelsModal({ lambda }) {
  const modalOpeningComponent = (
    <Tooltip
      content={LAMBDA_DETAILS.LABELS.POPUP_MESSAGE}
      position="top"
      trigger="mouseenter"
      tippyProps={{
        distance: 8,
      }}
    >
      <Icon glyph="edit" />
    </Tooltip>
  );

  return (
    <ModalWithForm
      title={LAMBDA_DETAILS.LABELS.EDIT_MODAL.TITLE}
      modalOpeningComponent={modalOpeningComponent}
      confirmText={LAMBDA_DETAILS.LABELS.EDIT_MODAL.CONFIRM_BUTTON.TEXT}
      id="edit-labels-modal"
      className="lambda-details-header__edit-labels-modal"
      renderForm={props => <EditLambdaLabelsForm lambda={lambda} {...props} />}
    />
  );
}
