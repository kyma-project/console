import React, { useState } from 'react';

import { Button, Alert } from 'fundamental-react';
import { Spinner, Tooltip } from 'react-shared';

import { useServiceInstancesQuery } from 'components/Lambdas/gql/hooks/queries';

import ModalWithForm from 'components/ModalWithForm/ModalWithForm';
import CreateServiceBindingForm from './CreateServiceBindingForm';

import { SERVICE_BINDINGS_PANEL } from 'components/Lambdas/constants';

export default function CreateServiceBindingModal({ lambda, refetchLambda }) {
  const [popupModalMessage, setPopupModalMessage] = useState('');
  const {
    serviceInstances,
    loading,
    error,
    refetchServiceInstances,
  } = useServiceInstancesQuery({
    namespace: lambda.namespace,
    serviceBindingUsages: lambda.serviceBindingUsages,
  });

  let fallbackContent = null;
  if (error) {
    fallbackContent = (
      <Alert dismissible={false} type="error">
        {error}
      </Alert>
    );
  }
  if (!fallbackContent && loading) {
    fallbackContent = <Spinner />;
  }

  const button = (
    <Button glyph="add" option="light" disabled={!serviceInstances.length}>
      {SERVICE_BINDINGS_PANEL.CREATE_MODAL.OPEN_BUTTON.TEXT}
    </Button>
  );
  const modalOpeningComponent = serviceInstances.length ? (
    button
  ) : (
    <Tooltip
      title={
        SERVICE_BINDINGS_PANEL.CREATE_MODAL.OPEN_BUTTON
          .NOT_ENTRIES_POPUP_MESSAGE
      }
      position="top"
      trigger="mouseenter"
      tippyProps={{
        distance: 16,
      }}
    >
      {button}
    </Tooltip>
  );

  const renderForm = props => (
    <div className="create-service-binding-modal">
      {fallbackContent || (
        <CreateServiceBindingForm
          {...props}
          serviceInstances={serviceInstances}
          setPopupModalMessage={setPopupModalMessage}
          refetchLambda={refetchLambda}
          refetchServiceInstances={refetchServiceInstances}
        />
      )}
    </div>
  );

  return (
    <ModalWithForm
      title={SERVICE_BINDINGS_PANEL.CREATE_MODAL.TITLE}
      modalOpeningComponent={modalOpeningComponent}
      confirmText={SERVICE_BINDINGS_PANEL.CREATE_MODAL.CONFIRM_BUTTON.TEXT}
      invalidPopupMessage={popupModalMessage}
      id="create-service-binding-modal"
      renderForm={renderForm}
    />
  );
}
