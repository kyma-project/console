import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import ConfigurationForm from './ConfigurationForm/ConfigurationForm';
import ServiceBindingsWrapper from './ServiceBindings/ServiceBindingsWrapper';
import EventTriggersWrapper from './EventTriggers/EventTriggersWrapper';

const BACKEND_MODULES = {
  SERVICE_CATALOG: 'servicecatalog',
  SERVICE_CATALOG_ADDONS: 'servicecatalogaddons',
  APPLICATION: 'application',
  EVENTING: 'eventing',
};

const backendModulesExist = (
  existingBackendModules = [],
  backendModules = [],
) => {
  if (!existingBackendModules.length || !backendModules.length) {
    return false;
  }

  for (const backendModule of backendModules) {
    if (!existingBackendModules.includes(backendModule)) {
      return false;
    }
  }

  return true;
};

const ConfigurationTab = props => {
  const backendModules = LuigiClient.getEventData().backendModules;

  const serviceBindings = backendModulesExist(backendModules, [
    BACKEND_MODULES.SERVICE_CATALOG,
    BACKEND_MODULES.SERVICE_CATALOG_ADDONS,
  ]) ? (
    <ServiceBindingsWrapper
      lambda={props.lambda}
      refetchLambda={props.refetchLambda}
    />
  ) : null;

  const eventTriggers = backendModulesExist(backendModules, [
    BACKEND_MODULES.APPLICATION,
    BACKEND_MODULES.EVENTING,
  ]) ? (
    <EventTriggersWrapper lambda={props.lambda} />
  ) : null;

  return (
    <>
      <ConfigurationForm {...props} />
      {eventTriggers}
      {serviceBindings}
    </>
  );
};

ConfigurationTab.propTypes = {
  lambda: PropTypes.object.isRequired,
  refetchLambda: PropTypes.func.isRequired,
  formRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  sizeRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  runtimeRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  LabelsEditor: PropTypes.element.isRequired,
};

export default ConfigurationTab;
