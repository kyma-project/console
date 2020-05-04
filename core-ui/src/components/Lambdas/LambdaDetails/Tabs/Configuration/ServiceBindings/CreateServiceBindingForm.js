import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormItem, FormLabel, FormInput, Alert } from 'fundamental-react';

import Checkbox from 'components/Lambdas/Checkbox/Checkbox';

import { useCreateServiceBindingUsage } from 'components/Lambdas/gql/hooks/mutations';

import { SERVICE_BINDINGS_PANEL } from 'components/Lambdas/constants';

const checkBoxInputProps = {
  style: {
    marginRight: '6px',
  },
};

export default function CreateServiceBindingForm({
  lambda,
  serviceInstances = [],
  setPopupModalMessage = () => void 0,
  refetchServiceInstances = () => void 0,
  onChange,
  formElementRef,
  setValidity = () => void 0,
  isOpen = false,
}) {
  const createServiceBindingUsage = useCreateServiceBindingUsage({ lambda });

  const [serviceInstanceName, setServiceInstanceName] = useState('');
  const [envPrefix, setEnvPrefix] = useState('');

  const [createCredentials, setCreateCredentials] = useState(true);
  const [existingCredentials, setExistingCredentials] = useState('');
  const [secrets, setSecrets] = useState([]);

  useEffect(() => {
    setValidity(false);
  }, [setValidity]);

  useEffect(() => {
    if (isOpen) {
      refetchServiceInstances();
    }
  }, [isOpen, refetchServiceInstances]);

  useEffect(() => {
    if (!serviceInstanceName) {
      setEnvPrefix('');
      setCreateCredentials(true);
    }

    const instance = serviceInstances.find(
      service => service.name === serviceInstanceName,
    );

    if (instance) {
      setSecrets(instance.serviceBindings.items);
    }
  }, [serviceInstanceName, serviceInstances]);

  useEffect(() => {
    if (!serviceInstanceName) {
      setPopupModalMessage(
        SERVICE_BINDINGS_PANEL.CREATE_MODAL.CONFIRM_BUTTON.POPUP_MESSAGES
          .NO_SERVICE_INSTANCE_SELECTED,
      );
      setValidity(false);
      return;
    }

    if (!createCredentials && !existingCredentials) {
      setPopupModalMessage(
        SERVICE_BINDINGS_PANEL.CREATE_MODAL.CONFIRM_BUTTON.POPUP_MESSAGES
          .NO_SECRET_SELECTED,
      );
      setValidity(false);
      return;
    }

    setValidity(true);
  }, [
    serviceInstanceName,
    createCredentials,
    existingCredentials,
    setValidity,
    setPopupModalMessage,
  ]);

  useEffect(() => {
    setExistingCredentials('');
  }, [serviceInstanceName, createCredentials]);

  async function handleFormSubmit() {
    const parameters = {
      serviceInstanceName: serviceInstanceName,
      serviceBindingUsageParameters: envPrefix
        ? {
            envPrefix: {
              name: envPrefix,
            },
          }
        : undefined,
      createCredentials: createCredentials,
      existingCredentials: existingCredentials || undefined,
    };

    refetchServiceInstances();
    await createServiceBindingUsage(parameters);
  }

  const serviceInstancesNames = serviceInstances.map(service => (
    <option value={service.name} key={service.name}>
      {service.name}
    </option>
  ));

  const noSecretsFound = (
    <Alert dismissible={false} type="information">
      {SERVICE_BINDINGS_PANEL.FORM.NO_SECRETS_FOUND}
    </Alert>
  );

  return (
    <form
      ref={formElementRef}
      style={{ width: '30em' }}
      onChange={onChange}
      onSubmit={handleFormSubmit}
    >
      <FormItem key="serviceInstanceName">
        <FormLabel htmlFor="serviceInstanceName">Service Instance</FormLabel>
        <select
          id="serviceInstanceName"
          value={serviceInstanceName}
          onChange={e => setServiceInstanceName(e.target.value)}
          required
        >
          <option value=""></option>
          {serviceInstancesNames}
        </select>
      </FormItem>

      <FormItem key="envPrefix">
        <FormLabel htmlFor="envPrefix">Prefix for injected variables</FormLabel>
        <FormInput
          id="envPrefix"
          placeholder="Set a prefix for variables (optional)"
          type="text"
          value={envPrefix}
          onChange={e => setEnvPrefix(e.target.value)}
        />
      </FormItem>

      {serviceInstanceName && (
        <>
          <FormItem key="createCredentials">
            <Checkbox
              name="createCredentials"
              value="Create new Secret"
              inputProps={checkBoxInputProps}
              initialChecked={true}
              onChange={(_, value) => setCreateCredentials(value)}
            />
          </FormItem>

          {!createCredentials && secrets.length ? (
            <FormItem key="existingCredentials">
              <FormLabel htmlFor="existingCredentials">Secrets</FormLabel>
              <select
                id="existingCredentials"
                value={existingCredentials}
                onChange={e => setExistingCredentials(e.target.value)}
                required
              >
                <option value=""></option>
                {secrets.map(secret => (
                  <option value={secret.name} key={secret.name}>
                    {secret.name}
                  </option>
                ))}
              </select>
            </FormItem>
          ) : null}
          {!createCredentials && !secrets.length ? noSecretsFound : null}
        </>
      )}
    </form>
  );
}

CreateServiceBindingForm.propTypes = {
  onChange: PropTypes.func,
  onCompleted: PropTypes.func,
  onError: PropTypes.func,
  formElementRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
};
