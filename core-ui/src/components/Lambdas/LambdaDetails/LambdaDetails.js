import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import { useMutation } from '@apollo/react-hooks';
import { TabGroup, Tab } from 'fundamental-react';
import LabelSelectorInput from '../../LabelSelectorInput/LabelSelectorInput';

import { UPDATE_LAMBDA } from '../../../gql/mutations';
import LambdaDetailsHeader from './LambdaDetailsHeader/LambdaDetailsHeader';

import { useNotification } from '../../../contexts/notifications';
import CodeTab from './Tabs/Code/CodeTab';
import LambdaCode from './Tabs/Code/LambdaCode';
import LambdaDependencies from './Tabs/Code/LambdaDependencies';
import ConfigurationTab from './Tabs/Configuration/Configuration';

const exampleLambdaCode = `module.exports = { 
  main: function (event, context) {

  }
}`;

const exampleDependencies = `{ 
  "name": "%NAME%",
  "version": "1.0.0",
  "dependencies": {}
}`;

export default function LambdaDetails({ lambda }) {
  const [labels, setLabels] = useState(lambda.labels);
  const [lambdaCode, setLambdaCode] = useState(
    lambda.content || exampleLambdaCode,
  );
  const [dependencies, setDependencies] = useState(
    lambda.dependencies || exampleDependencies.replace('%NAME%', lambda.name),
  );
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [updateLambdaMutation] = useMutation(UPDATE_LAMBDA);
  const notificationManager = useNotification();

  const formRef = useRef(null);

  const formValues = {
    size: useRef(null),
    runtime: useRef(null),
  };

  const namespace = LuigiClient.getEventData().environmentId;
  const selectedTabName =
    LuigiClient.getNodeParams().selectedTab || 'Configuration';
  useEffect(() => {
    const selectedTabIndex = selectedTabName === 'Configuration' ? 0 : 1;
    setSelectedTabIndex(selectedTabIndex);
  }, [selectedTabName]);

  async function updateLambda() {
    if (!formRef.current.checkValidity()) {
      return;
    }

    try {
      const updatedFunction = await updateLambdaMutation({
        variables: {
          name: lambda.name,
          namespace,
          params: {
            labels: labels || {},
            size: formValues.size.current.value,
            runtime: formValues.runtime.current.value,
            content: lambdaCode,
            dependencies,
          },
        },
      });

      const isSuccess =
        updatedFunction.data &&
        updatedFunction.data.updateFunction &&
        updatedFunction.data.updateFunction.name === lambda.name;
      if (isSuccess) {
        notificationManager.notify({
          content: `Lambda ${lambda.name} updated successfully`,
          title: 'Success',
          color: '#107E3E',
          icon: 'accept',
          autoClose: true,
        });
      }
    } catch (e) {
      notificationManager.notify({
        content: `Error while removing lambda ${lambda.name}: ${e.message}`,
        title: 'Error',
        color: '#BB0000',
        icon: 'decline',
        autoClose: false,
      });
    }
  }

  function updateLabels(newLabels) {
    setLabels(newLabels);
  }

  const onChangeTab = (_, id) => {
    const selectedTab = id === 0 ? 'Configuration' : 'Code';
    try {
      LuigiClient.linkManager()
        .withParams({ selectedTab })
        .navigate('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <LambdaDetailsHeader
        lambda={lambda}
        handleUpdate={updateLambda}
      ></LambdaDetailsHeader>
      <TabGroup selectedIndex={selectedTabIndex} onTabClick={onChangeTab}>
        <Tab
          key="lambda-configuration"
          id="lambda-configuration"
          title="Configuration"
        >
          <ConfigurationTab
            lambda={lambda}
            formRef={formRef}
            sizeRef={formValues.size}
            runtimeRef={formValues.runtime}
            LabelsEditor={
              <LabelSelectorInput labels={labels} onChange={updateLabels} />
            }
          />
        </Tab>

        <Tab key="lambda-code" id="lambda-code" title="Code">
          <CodeTab
            codeEditorComponent={
              <LambdaCode code={lambdaCode} setCode={setLambdaCode} />
            }
            dependenciesComponent={
              <LambdaDependencies
                dependencies={dependencies}
                setDependencies={setDependencies}
              />
            }
          />
        </Tab>
      </TabGroup>
    </>
  );
}

LambdaDetails.propTypes = {
  lambda: PropTypes.object.isRequired,
};
