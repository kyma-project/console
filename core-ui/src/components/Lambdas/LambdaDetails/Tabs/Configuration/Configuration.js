import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import ServiceBindingsWrapper from './ServiceBindings/ServiceBindingsWrapper';
import EventTriggersWrapper from './EventTriggers/EventTriggersWrapper';

import {
  BACKEND_MODULES,
  backendModulesExist,
} from 'components/Lambdas/helpers/misc';

const ConfigurationTab = ({ lambda, setBindingUsages }) => {
  const backendModules = LuigiClient.getEventData().backendModules;

  const serviceBindings = backendModulesExist(backendModules, [
    BACKEND_MODULES.SERVICE_CATALOG,
    BACKEND_MODULES.SERVICE_CATALOG_ADDONS,
  ]) ? (
    <ServiceBindingsWrapper
      lambda={lambda}
      setBindingUsages={setBindingUsages}
    />
  ) : null;

  const eventTriggers = backendModulesExist(backendModules, [
    BACKEND_MODULES.APPLICATION,
    BACKEND_MODULES.EVENTING,
  ]) ? (
    <EventTriggersWrapper lambda={lambda} />
  ) : null;

  return (
    <>
      {/* <ResourcesManagement 
        lambda={lambda}
      /> */}
      {eventTriggers}
      {serviceBindings}
    </>
  );
};

ConfigurationTab.propTypes = {
  lambda: PropTypes.object.isRequired,
  setBindingUsages: PropTypes.func.isRequired,
};

export default ConfigurationTab;
