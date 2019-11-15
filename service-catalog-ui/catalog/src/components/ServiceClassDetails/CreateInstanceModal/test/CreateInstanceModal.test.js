import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import { componentUpdate } from '../../../../testing';
import {
  clusterServiceClassDetails,
  clusterServiceClass1Name,
} from '../../../../testing/serviceClassesMocks';

import {
  createServiceInstanceSuccessfulMock,
  createServiceInstanceErrorMock,
  mockEnvironmentId,
} from '../../../../testing/queriesMocks';

import CreateInstanceModal from '../CreateInstanceModal.component';

const onCompleted = jest.fn();
const onError = jest.fn();
const onChange = jest.fn();

jest.mock('@kyma-project/luigi-client', () => {
  return {
    getEventData: () => {
      return {
        environmentId: mockEnvironmentId,
      };
    },
    linkManager: () => {
      return {
        fromContext: () => ({ navigate: () => {} }),
        navigate: () => {
          return;
        },
      };
    },
  };
});

describe('CreateInstanceModal', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <MockedProvider>
        <CreateInstanceModal
          checkInstanceExistQuery={{ serviceInstances: [] }}
          item={clusterServiceClassDetails}
          formElementRef={{ current: null }}
          jsonSchemaFormRef={{ current: null }}
          onChange={onChange}
          onError={onError}
          onCompleted={onCompleted}
        />
      </MockedProvider>,
    );

    expect(component).toBeTruthy();
  });

  it('Shows filled instance name input, predefined dropdowns and does not allow to submit form', async () => {
    const component = mount(
      <MockedProvider>
        <CreateInstanceModal
          checkInstanceExistQuery={{ serviceInstances: [] }}
          item={clusterServiceClassDetails}
          formElementRef={{ current: null }}
          jsonSchemaFormRef={{ current: null }}
          onChange={onChange}
          onError={onError}
          onCompleted={onCompleted}
        />
      </MockedProvider>,
    );

    await componentUpdate(component);
    await componentUpdate(component);

    const instanceNameSelector = 'input#instanceName';
    const instanceNameInput = component.find(instanceNameSelector);
    expect(instanceNameInput.exists()).toEqual(true);
    expect(instanceNameInput.instance().value).not.toEqual('');

    const instancePlanSelector = '#plan';
    const instancePlanInput = component.find(instancePlanSelector);
    expect(instancePlanInput.exists()).toEqual(true);
    expect(instancePlanInput.instance().value).toEqual(
      'a6078798-70a1-4674-af90-aba364dd6a56',
    );
    expect(instancePlanInput.props().children.length).toEqual(1);

    const instanceImagePullPolicySelector = 'select#root_imagePullPolicy';
    const instanceImagePullPolicyInput = component.find(
      instanceImagePullPolicySelector,
    );

    expect(instanceImagePullPolicyInput.exists()).toEqual(true);
    expect(instanceImagePullPolicyInput.instance().value).toEqual(
      'IfNotPresent',
    );

    expect(
      component
        .find('form#createInstanceForm')
        .instance()
        .checkValidity(),
    ).toEqual(true);
  });

  it('Does not allow to submit form with invalid instance name', async () => {
    const component = mount(
      <MockedProvider>
        <CreateInstanceModal
          checkInstanceExistQuery={{ serviceInstances: [] }}
          item={clusterServiceClassDetails}
          formElementRef={{ current: null }}
          jsonSchemaFormRef={{ current: null }}
          onChange={onChange}
          onError={onError}
          onCompleted={onCompleted}
        />
      </MockedProvider>,
    );

    await componentUpdate(component);
    await componentUpdate(component);

    const instanceNameInput = component.find('input#instanceName');
    instanceNameInput.instance().value = '';
    expect(instanceNameInput.instance().value).toEqual('');

    expect(
      component
        .find('form#createInstanceForm')
        .instance()
        .checkValidity(),
    ).toEqual(false);
  });

  it('Creates instance properly', async () => {
    const ref = React.createRef();

    const gqlMock = createServiceInstanceSuccessfulMock();

    const component = mount(
      <MockedProvider mocks={[gqlMock]} addTypename={false}>
        <CreateInstanceModal
          checkInstanceExistQuery={{ serviceInstances: [] }}
          item={clusterServiceClassDetails}
          formElementRef={ref}
          jsonSchemaFormRef={{ current: null }}
          onChange={onChange}
          onError={onError}
          onCompleted={onCompleted}
        />
      </MockedProvider>,
    );

    await componentUpdate(component);
    await componentUpdate(component);

    const instanceNameInput = component.find('input#instanceName');
    instanceNameInput.simulate('change', {
      target: { value: clusterServiceClass1Name },
    });

    await componentUpdate(component);
    await componentUpdate(component);

    const form = component.find('form#createInstanceForm');
    form.simulate('submit');

    await componentUpdate(component);
    expect(gqlMock.result).toHaveBeenCalled();

    expect(onCompleted).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('Shows error notification if an error occured', async () => {
    const ref = React.createRef();

    const gqlMock = createServiceInstanceErrorMock();

    const component = mount(
      <MockedProvider mocks={[gqlMock]} addTypename={false}>
        <CreateInstanceModal
          checkInstanceExistQuery={{ serviceInstances: [] }}
          item={clusterServiceClassDetails}
          formElementRef={ref}
          jsonSchemaFormRef={{ current: null }}
          onChange={onChange}
          onError={onError}
          onCompleted={onCompleted}
        />
      </MockedProvider>,
    );

    await componentUpdate(component);
    await componentUpdate(component);

    const instanceNameInput = component.find('input#instanceName');
    instanceNameInput.simulate('change', {
      target: { value: clusterServiceClass1Name },
    });

    await componentUpdate(component);
    await componentUpdate(component);
    const form = component.find('form#createInstanceForm');
    form.simulate('submit');

    await componentUpdate(component);

    expect(onCompleted).toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
  });
});
