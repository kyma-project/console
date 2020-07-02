import React from 'react';

import ResourcesManagement from './ResourceManagement/ResourceManagement';
import EventTriggersWrapper from './EventTriggers/EventTriggersWrapper';
import ServiceBindingsWrapper from './ServiceBindings/ServiceBindingsWrapper';
import ApiRules from './ApiRules/ApiRules';
import {
  BACKEND_MODULES,
  backendModulesExist,
} from 'components/Lambdas/helpers/misc';

export default function ConfigurationTab({
  lambda,
  setBindingUsages = () => void 0,
  backendModules = [],
}) {
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

  const apiRules = backendModulesExist(backendModules, [
    BACKEND_MODULES.API_GATEWAY,
  ]) ? (
    <ApiRules lambda={lambda} />
  ) : null;

  return (
    <>
      <ResourcesManagement lambda={lambda} />
      {apiRules}
      {eventTriggers}
      {serviceBindings}
    </>
  );
}
