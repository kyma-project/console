import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import { componentUpdate } from '../../../../testing';
import { clusterServiceClassDetails } from '../../../../testing/serviceClassesMocks';

import CreateInstanceModal from '../CreateInstanceModal';
import {
  createServiceInstanceSuccessfulMock,
  createServiceInstanceErrorMock,
} from './gqlMocks';

jest.mock('@kyma-project/luigi-client', () => {
  return {
    getEventData: () => {
      return {
        environmentId: 'testnamespace',
      };
    },
    linkManager: () => {
      return {
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
          item={clusterServiceClassDetails}
          formElementRef={{ current: null }}
        />
      </MockedProvider>,
    );

    expect(component).toBeTruthy();
  });

  it('Shows filled instance name input, predefined dropdowns and does not allow to submit form', () => {
    const component = mount(
      <MockedProvider>
        <CreateInstanceModal
          item={clusterServiceClassDetails}
          formElementRef={{ current: null }}
        />
      </MockedProvider>,
    );

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
        .find('form')
        .instance()
        .checkValidity(),
    ).toEqual(false);
  });

  // it('Allows to submit form with valid lambda name', () => {
  //   const component = mount(
  //     <MockedProvider>
  //       <CreateInstanceModal item={clusterServiceClassDetails} formElementRef={{ current: null }} />
  //     </MockedProvider>,
  //   );

  //   const lambdaNameSelector = 'input#lambdaName';
  //   const lambdaNameInput = component.find(lambdaNameSelector);
  //   expect(lambdaNameInput.exists()).toEqual(true);
  //   expect(lambdaNameInput.instance().value).toEqual('');

  //   lambdaNameInput.instance().value = 'validname';
  //   expect(lambdaNameInput.instance().value).toEqual('validname');

  //   expect(
  //     component
  //       .find('form')
  //       .instance()
  //       .checkValidity(),
  //   ).toEqual(true);
  // });

  // it('Does not allow to submit form with invalid lambda name', () => {
  //   const component = mount(
  //     <MockedProvider>
  //       <CreateInstanceModal item={clusterServiceClassDetails} formElementRef={{ current: null }} />
  //     </MockedProvider>,
  //   );

  //   const lambdaNameSelector = 'input#lambdaName';
  //   const lambdaNameInput = component.find(lambdaNameSelector);
  //   expect(lambdaNameInput.exists()).toEqual(true);
  //   expect(lambdaNameInput.instance().value).toEqual('');

  //   lambdaNameInput.instance().value = '1invalidName';
  //   expect(lambdaNameInput.instance().value).toEqual('1invalidName');

  //   expect(
  //     component
  //       .find('form')
  //       .instance()
  //       .checkValidity(),
  //   ).toEqual(false);
  // });

  // it('Creates lambda properly', async () => {
  //   const onError = jest.fn();
  //   const onCompleted = jest.fn();
  //   const ref = React.createRef();

  //   const gqlMock = [createServiceInstanceSuccessfulMock()];

  //   const component = mount(
  //     <MockedProvider mocks={gqlMock} addTypename={false}>
  //       <CreateInstanceModal
  //         item={clusterServiceClassDetails}
  //         onError={onError}
  //         onCompleted={onCompleted}
  //         formElementRef={ref}
  //       />
  //     </MockedProvider>,
  //   );

  //   const lambdaNameSelector = 'input#lambdaName';
  //   const lambdaNameInput = component.find(lambdaNameSelector);
  //   lambdaNameInput.instance().value = 'testname';

  //   const form = component.find('form');
  //   form.simulate('submit');

  //   await componentUpdate(component);

  //   expect(gqlMock[0].result).toHaveBeenCalled();

  //   expect(onCompleted).toHaveBeenCalled();
  //   expect(onError).not.toHaveBeenCalled();
  // });

  // it('Shows error notification if an error occured', async () => {
  //   const onError = jest.fn();
  //   const onCompleted = jest.fn();
  //   const ref = React.createRef();

  //   const gqlMock = [createServiceInstanceErrorMock()];

  //   const component = mount(
  //     <MockedProvider mocks={gqlMock} addTypename={false}>
  //       <CreateInstanceModal
  //         item={clusterServiceClassDetails}
  //         onError={onError}
  //         onCompleted={onCompleted}
  //         formElementRef={ref}
  //       />
  //     </MockedProvider>,
  //   );

  //   const lambdaNameSelector = 'input#lambdaName';
  //   const lambdaNameInput = component.find(lambdaNameSelector);
  //   lambdaNameInput.instance().value = 'testname';

  //   const form = component.find('form');
  //   form.simulate('submit');

  //   await componentUpdate(component);

  //   expect(onCompleted).not.toHaveBeenCalled();
  //   expect(onError).toHaveBeenCalled();
  // });
});
