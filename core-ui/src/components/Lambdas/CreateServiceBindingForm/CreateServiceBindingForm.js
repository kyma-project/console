import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormItem, FormLabel, FormInput } from 'fundamental-react';

import Checkbox from '../Checkbox/Checkbox';

import { useServiceBindings } from '../LambdaDetails/Tabs/Configuration/ServiceBindings/ServiceBindingsService';

const checkBoxInputProps = {
  style: {
    marginRight: '6px',
  },
};

export default function CreateServiceBindingForm({
  serviceInstances = [],
  refetchLambda,
  refetchInstances,
  onChange,
  formElementRef,
  setValidity = () => void 0,
  isOpen = false,
}) {
  const { createServiceBinding } = useServiceBindings();

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
      refetchInstances();
    }
  }, [isOpen, refetchInstances]);

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
      setValidity(false);
      return;
    }

    if (!createCredentials && !existingCredentials) {
      setValidity(false);
      return;
    }

    setValidity(true);
  }, [
    serviceInstanceName,
    createCredentials,
    existingCredentials,
    setValidity,
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

    await createServiceBinding(parameters, refetchLambda);
  }

  const serviceInstancesNames = serviceInstances.map(service => (
    <option value={service.name} key={service.name}>
      {service.name}
    </option>
  ));

  return (
    <form
      ref={formElementRef}
      style={{ width: '30em' }}
      onChange={onChange}
      onSubmit={handleFormSubmit}
    >
      <FormItem key="serviceInstanceName">
        <FormLabel htmlFor="serviceInstanceName">Service Instance*</FormLabel>
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
          {!createCredentials && !secrets.length ? (
            <p>
              No Secrets available. Create new Secret to bind the Service
              Instance.
            </p>
          ) : null}
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
