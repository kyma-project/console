import React, { useState } from 'react';
import { TabGroup, Tab } from 'fundamental-react';

import LambdaDetailsHeader from './LambdaDetailsHeader/LambdaDetailsHeader';

import CodeTab from './Tabs/Code/CodeTab';
import ConfigurationTab from './Tabs/Configuration/ConfigurationTab';

import { useLogsView } from '../helpers/misc';

import { LAMBDA_DETAILS } from 'components/Lambdas/constants';

export default function LambdaDetails({ lambda, backendModules = [] }) {
  const [bindingUsages, setBindingUsages] = useState([]);

  useLogsView(lambda.UID, lambda.namespace);

  return (
    <>
      <LambdaDetailsHeader lambda={lambda} />
      <TabGroup className="lambda-details-tabs">
        <Tab
          key="lambda-code"
          id="lambda-code"
          title={LAMBDA_DETAILS.TABS.CODE.TITLE}
        >
          <CodeTab lambda={lambda} bindingUsages={bindingUsages} />
        </Tab>
        <Tab
          key="lambda-configuration"
          id="lambda-configuration"
          title={LAMBDA_DETAILS.TABS.CONFIGURATION.TITLE}
        >
          <ConfigurationTab
            lambda={lambda}
            setBindingUsages={setBindingUsages}
            backendModules={backendModules}
          />
        </Tab>
      </TabGroup>
    </>
  );
}
