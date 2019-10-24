import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  FormItem,
  FormLabel,
  Panel,
  TabGroup,
  Tab,
  Toggle,
} from 'fundamental-react';
import Editor from '@monaco-editor/react';

import { GET_LAMBDA } from '../../../gql/queries';
import { UPDATE_LAMBDA } from '../../../gql/mutations';
import LambdaDetailsHeader from './LambdaDetailsHeader/LambdaDetailsHeader';
import LabelSelectorInput from '../../LabelSelectorInput/LabelSelectorInput';
import Spinner from '../../../shared/components/Spinner/Spinner';
import { useNotification } from '../../../contexts/notifications';

export default function LambdaDetails({ lambdaId }) {
  const [labels, setLabels] = useState({});
  const [updateLambdaMutation] = useMutation(UPDATE_LAMBDA);
  const [isEditorShown, setIsEditorShown] = useState(false);
  const [lambdaCode, setLambdaCode] = useState("console.log('Hello World!)");
  const notificationManager = useNotification();

  const formValues = {
    size: useRef(null),
    runtime: useRef(null),
  };

  const namespace = LuigiClient.getEventData().environmentId;

  const { data, error, loading } = useQuery(GET_LAMBDA, {
    variables: {
      name: lambdaId,
      namespace,
    },
  });

  useEffect(() => {
    if (data && data.function) {
      setLabels(data.function.labels);
      setLambdaCode(data.function.content);
    }
  }, [data]);

  if (error) {
    return `Error! ${error.message}`;
  }
  if (loading || !data) {
    return <Spinner />;
  }

  const lambda = data.function;

  //move it to header ?
  async function updateLambda() {
    try {
      const updatedFunction = await updateLambdaMutation({
        variables: {
          name: lambdaId,
          namespace,
          params: {
            labels,
            size: formValues.size.current.value,
            runtime: formValues.runtime.current.value,
            content: '',
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

  function handleEditorDidMount(_valueGetter) {
    setInterval(() => console.log(_valueGetter), 1000);
  }

  return (
    <>
      {/* pass only info that is needed */}
      <LambdaDetailsHeader
        lambda={lambda}
        handleUpdate={updateLambda}
      ></LambdaDetailsHeader>
      <TabGroup>
        <Tab
          key={'lambda-configuration'}
          id={'lambda-configuration'}
          title={'Configuration'}
        >
          <Panel className="fd-has-margin-medium">
            <Panel.Header>
              <Panel.Head title="General Configuration" />
            </Panel.Header>
            <Panel.Body>
              <LabelSelectorInput labels={labels} onChange={updateLabels} />
              <FormItem>
                <FormLabel htmlFor="lambdaSize">Size*</FormLabel>
                <select
                  id="lambdaSize"
                  defaultValue={lambda.size}
                  ref={formValues.size}
                >
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                </select>
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="lambdaRuntime">Runtime*</FormLabel>
                <select
                  id="lambdaRuntime"
                  defaultValue={lambda.runtime}
                  ref={formValues.runtime}
                >
                  <option value="nodejs6">Nodejs 6</option>
                  <option value="nodejs8">Nodejs 8</option>
                </select>
              </FormItem>
            </Panel.Body>
          </Panel>
        </Tab>

        <Tab key={'lambda-code'} id={'lambda-code'} title={'Code'}>
          <Panel className="fd-has-margin-medium">
            <Panel.Header>
              <Panel.Head title="Function Code" />
            </Panel.Header>
            <Panel.Body>
              <Editor
                height="500px"
                language="javascript"
                theme="vs-light"
                value={lambdaCode}
                editorDidMount={handleEditorDidMount}
              />
            </Panel.Body>
          </Panel>
        </Tab>
      </TabGroup>
    </>
  );
}

LambdaDetails.propTypes = {
  lambdaId: PropTypes.string.isRequired,
};
