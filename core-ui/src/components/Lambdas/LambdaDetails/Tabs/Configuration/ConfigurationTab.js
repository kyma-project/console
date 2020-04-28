import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import ServiceBindingsWrapper from './ServiceBindings/ServiceBindingsWrapper';
import EventTriggersWrapper from './EventTriggers/EventTriggersWrapper';
import { ResourcesManagement } from './ResourceManagement/ResourceManagement';
import {
  BACKEND_MODULES,
  backendModulesExist,
} from 'components/Lambdas/helpers/misc';

export default function ConfigurationTab({
  lambda,
  setBindingUsages = () => void 0,
}) {
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
      <ResourcesManagement lambda={lambda} />
      {eventTriggers}
      {serviceBindings}
    </>
  );
}
