import React, { useState, useEffect } from 'react';
import { TabGroup, Tab } from 'fundamental-react';

import LambdaDetailsHeader from './LambdaDetailsHeader/LambdaDetailsHeader';

import CodeTab from './Tabs/Code/CodeTab';
import ConfigurationTab from './Tabs/Configuration/ConfigurationTab';

import { logsViewHelpers } from 'components/Lambdas/helpers/lambdas';

import { LAMBDA_DETAILS } from 'components/Lambdas/constants';

export default function LambdaDetails({ lambda }) {
  const [bindingUsages, setBindingUsages] = useState([]);

  useEffect(() => {
    const splitViewInstance = logsViewHelpers.openAsSplitView(lambda);

    return () => {
      // workaround for destroy splitView with navigation from details to list view
      // close doesn't work with collapsed state, so first expand and then close
      splitViewInstance.expand && splitViewInstance.expand();
      splitViewInstance.close && splitViewInstance.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          />
        </Tab>
      </TabGroup>
    </>
  );
}
