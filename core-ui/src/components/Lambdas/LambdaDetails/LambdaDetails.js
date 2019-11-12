import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { TabGroup, Tab } from 'fundamental-react';
import LabelSelectorInput from '../../LabelSelectorInput/LabelSelectorInput';

import { GET_LAMBDA } from '../../../gql/queries';
import { UPDATE_LAMBDA } from '../../../gql/mutations';
import LambdaDetailsHeader from './LambdaDetailsHeader/LambdaDetailsHeader';

import EntryNotFound from '../../EntryNotFound/EntryNotFound';
import Spinner from '../../../shared/components/Spinner/Spinner';
import { useNotification } from '../../../contexts/notifications';
import CodeTab from './Tabs/Code';
import ConfigurationTab from './Tabs/Configuration';

export default function LambdaDetails({ lambdaId }) {
  const [labels, setLabels] = useState({});
  const [lambdaCode, setLambdaCode] = useState(
    `module.exports = { 
  main: function (event, context) {
 
  }
}`,
  );
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [updateLambdaMutation] = useMutation(UPDATE_LAMBDA);
  const notificationManager = useNotification();

  const formValues = {
    size: useRef(null),
    runtime: useRef(null),
    content: useRef(null),
  };

  const namespace = LuigiClient.getEventData().environmentId;
  const selectedTabName =
    LuigiClient.getNodeParams().selectedTab || 'Configuration';
  useEffect(() => {
    const selectedTabIndex = selectedTabName === 'Configuration' ? 0 : 1;
    setSelectedTabIndex(selectedTabIndex);
  }, [selectedTabName]);

  const { data, error, loading, stopPolling } = useQuery(GET_LAMBDA, {
    variables: {
      name: lambdaId,
      namespace,
    },
    fetchPolicy: 'no-cache',
    pollInterval: 500,
  });

  useEffect(() => {
    if (data && data.function) {
      setLabels(data.function.labels);
      if (data.function.content) {
        setLambdaCode(data.function.content);
      }
    }
  }, [data]);

  if (error) {
    return `Error! ${error.message}`;
  }
  if (loading || !data) {
    return <Spinner />;
  }
  if (data && !data.function) {
    setTimeout(() => {
      stopPolling();
    }, 3000);
    return <EntryNotFound entryType="Lambda" entryId={lambdaId} />;
  }
  if (data && data.function) {
    stopPolling();
  }

  const lambda = {};

  async function updateLambda() {
    try {
      const updatedFunction = await updateLambdaMutation({
        variables: {
          name: lambdaId,
          namespace,
          params: {
            labels: labels || {},
            size: formValues.size.current.value,
            runtime: formValues.runtime.current.value,
            content: formValues.content.current(),
            dependencies: '',
          },
        },
      });

      const isSuccess =
        updatedFunction.data &&
        updatedFunction.data.updateFunction &&
        updatedFunction.data.updateFunction.name === lambdaId;
      if (isSuccess) {
        notificationManager.notify({
          content: `Lambda ${lambdaId} updated successfully`,
          title: 'Success',
          color: '#107E3E',
          icon: 'accept',
          autoClose: true,
        });
      }
    } catch (e) {
      notificationManager.notify({
        content: `Error while removing lambda ${lambdaId}: ${e.message}`,
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
            sizeRef={formValues.size}
            runtimeRef={formValues.runtime}
            LabelsEditor={
              <LabelSelectorInput labels={labels} onChange={updateLabels} />
            }
          />
        </Tab>

        <Tab key="lambda-code" id="lambda-code" title="Code">
          <CodeTab lambdaCode={lambdaCode} contentRef={formValues.content} />
        </Tab>
      </TabGroup>
    </>
  );
}

LambdaDetails.propTypes = {
  lambdaId: PropTypes.string.isRequired,
};
