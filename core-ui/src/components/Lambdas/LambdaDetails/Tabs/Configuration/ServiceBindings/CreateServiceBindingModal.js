import React, { useState } from 'react';

import { Button, Alert } from 'fundamental-react';
import { Spinner, Tooltip, useGetList } from 'react-shared';

import ModalWithForm from 'components/ModalWithForm/ModalWithForm';
import CreateServiceBindingForm from './CreateServiceBindingForm';
import { SERVICE_BINDINGS_PANEL } from 'components/Lambdas/constants';

export default function CreateServiceBindingModal({
  lambda,
  serviceBindingsCombined,
}) {
  const [popupModalMessage, setPopupModalMessage] = useState('');

  const serviceInstancesAlreadyUsed = serviceBindingsCombined.map(
    ({ serviceBinding, serviceBindingUsage }) =>
      serviceBindingUsage && serviceBinding?.spec.instanceRef.name,
  );

  const isNotAlreadyUsed = serviceInstance =>
    !serviceInstancesAlreadyUsed.includes(serviceInstance.metadata.name);

  const {
    loading = true,
    error,
    data: serviceInstances,
    silentRefetch: refetchServiceInstances,
  } = useGetList()(
    `/apis/servicecatalog.k8s.io/v1beta1/namespaces/${lambda.metadata.namespace}/serviceinstances`,
    {
      pollingInterval: 3000,
    },
  );

  const instancesNotBound = serviceInstances?.filter(isNotAlreadyUsed) || [];
  const hasAnyInstances = !!instancesNotBound.length;

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
    <Button glyph="add" option="light" disabled={!hasAnyInstances}>
      {SERVICE_BINDINGS_PANEL.CREATE_MODAL.OPEN_BUTTON.TEXT}
    </Button>
  );
  const modalOpeningComponent = hasAnyInstances ? (
    button
  ) : (
    <Tooltip
      content={
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
          lambda={lambda}
          availableServiceInstances={instancesNotBound}
          setPopupModalMessage={setPopupModalMessage}
          serviceBindings={serviceBindingsCombined.map(
            ({ serviceBinding }) => serviceBinding,
          )}
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
