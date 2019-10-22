import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { useQuery } from '@apollo/react-hooks';
import { TabGroup, Tab, Panel, FormItem, FormLabel } from 'fundamental-react';

import LambdaDetailsHeader from './LambdaDetailsHeader/LambdaDetailsHeader';
import Spinner from '../../../shared/components/Spinner/Spinner';
import { GET_LAMBDA } from '../../../gql/queries';
import LabelSelectorInput from '../../LabelSelectorInput/LabelSelectorInput';

export default function LambdaDetails({ lambdaId }) {
  const namespace = LuigiClient.getEventData().environmentId;

  const { data, error, loading } = useQuery(GET_LAMBDA, {
    variables: {
      name: lambdaId,
      namespace: namespace,
    },
  });
  if (error) {
    return `Error! ${error.message}`;
  }
  if (loading || !data) {
    return <Spinner />;
  }

  const lambda = data.function;

  return (
    <>
      {/* pass only info that is needed */}
      <LambdaDetailsHeader lambda={lambda}></LambdaDetailsHeader>
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
              <LabelSelectorInput labels={lambda.labels} />
              <FormItem>
                <FormLabel htmlFor="lambdaSize">Size*</FormLabel>
                <select id="lambdaSize" value={lambda.size}>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                </select>
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="lambdaRuntime">Runtime*</FormLabel>
                <select id="lambdaRuntime" value={lambda.runtime}>
                  <option value="nodejs6">Nodejs 6</option>
                  <option value="nodejs8">Nodejs 8</option>
                </select>
              </FormItem>
            </Panel.Body>
          </Panel>
        </Tab>

        <Tab key={'lambda-code'} id={'lambda-code'} title={'Code'}>
          <Panel className="fd-has-margin-medium">
            <Panel.Body>
              <p className="fd-has-type-1">Code</p>
            </Panel.Body>
          </Panel>
        </Tab>
      </TabGroup>
    </>
  );
}
