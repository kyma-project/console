import React, { useState } from 'react';
import { TabGroup, Tab } from 'fundamental-react';

import CodeTab from './Tabs/Code/CodeTab';
import ResourceManagementTab from './Tabs/ResourceManagement/ResourceManagementTab';

import LambdaEventsWrapper from './Tabs/Configuration/EventTriggers/LambdaEventsWrapper';
import ServiceBindingsWrapper from './Tabs/Configuration/ServiceBindings/ServiceBindingsWrapper';
import ApiRules from './Tabs/Configuration/ApiRules/ApiRules';

// import { useLogsView } from '../helpers/misc';

import { LAMBDA_DETAILS } from 'components/Lambdas/constants';
import {
  BACKEND_MODULES,
  backendModulesExist,
} from 'components/Lambdas/helpers/misc';

export default function LambdaDetails({ lambda, backendModules = [] }) {
  const [bindingUsages, setBindingUsages] = useState([]);
  // useLogsView(lambda.UID, lambda.namespace);

  const apiRules = backendModulesExist(backendModules, [
    BACKEND_MODULES.API_GATEWAY,
  ]) ? (
    <ApiRules lambda={lambda} />
  ) : null;

  const eventTriggers = backendModulesExist(backendModules, [
    BACKEND_MODULES.APPLICATION,
    BACKEND_MODULES.EVENTING,
  ]) ? (
    <LambdaEventsWrapper lambda={lambda} />
  ) : null;

  const serviceBindings = backendModulesExist(backendModules, [
    BACKEND_MODULES.SERVICE_CATALOG,
    BACKEND_MODULES.SERVICE_CATALOG_ADDONS,
  ]) ? (
    <ServiceBindingsWrapper
      lambda={lambda}
      setBindingUsages={setBindingUsages}
    />
  ) : null;

  const configTabShouldRender = apiRules || eventTriggers || serviceBindings;

  return (
    <>
      <TabGroup className="lambda-details-tabs">
        <Tab
          key="lambda-code"
          id="lambda-code"
          title={LAMBDA_DETAILS.TABS.CODE.TITLE}
        >
          <CodeTab lambda={lambda} bindingUsages={bindingUsages} />
        </Tab>
        {configTabShouldRender && (
          <Tab
            key="lambda-configuration"
            id="lambda-configuration"
            title={LAMBDA_DETAILS.TABS.CONFIGURATION.TITLE}
          >
            {apiRules}
            {/* {eventTriggers} */}
            {serviceBindings}
          </Tab>
        )}
        <Tab
          key="lambda-resources"
          id="lambda-resources"
          title={LAMBDA_DETAILS.TABS.RESOURCE_MANAGEMENT.TITLE}
        >
          <ResourceManagementTab lambda={lambda} />
        </Tab>
      </TabGroup>
    </>
  );
}
