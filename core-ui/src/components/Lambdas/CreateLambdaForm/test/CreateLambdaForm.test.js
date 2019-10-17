import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import { componentUpdate } from '../../../../testing';

import CreateLambdaForm from '../CreateLambdaForm';
import { createLambdaSuccessfulMock, createLambdaErrorMock } from './gqlMocks';

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

describe('CreateLambdaForm', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <MockedProvider>
        <CreateLambdaForm formElementRef={{ current: null }} />
      </MockedProvider>,
    );

    expect(component).toBeTruthy();
  });

  it('Shows empty lambda name input, predefined dropdowns and does not allow to submit form', () => {
    const component = mount(
      <MockedProvider>
        <CreateLambdaForm formElementRef={{ current: null }} />
      </MockedProvider>,
    );

    const lambdaNameSelector = 'input#lambdaName';
    const lambdaNameInput = component.find(lambdaNameSelector);
    expect(lambdaNameInput.exists()).toEqual(true);
    expect(lambdaNameInput.instance().value).toEqual('');

    const lambdaSizeSelector = '#lambdaSize';
    const lamndaSizeInput = component.find(lambdaSizeSelector);
    expect(lamndaSizeInput.exists()).toEqual(true);
    expect(lamndaSizeInput.instance().value).toEqual('S');
    expect(lamndaSizeInput.props().defaultValue).toEqual('S');
    expect(lamndaSizeInput.props().children.length).toEqual(3);

    const lambdaRuntimeSelector = '#lambdaRuntime';
    const lambdaRuntimeInput = component.find(lambdaRuntimeSelector);
    expect(lambdaRuntimeInput.exists()).toEqual(true);
    expect(lambdaRuntimeInput.instance().value).toEqual('nodejs6');
    expect(lambdaRuntimeInput.props().defaultValue).toEqual('nodejs6');
    expect(lambdaRuntimeInput.props().children.length).toEqual(2);

    expect(
      component
        .find('form')
        .instance()
        .checkValidity(),
    ).toEqual(false);
  });

  it('Allows to submit form with valid lambda name', () => {
    const component = mount(
      <MockedProvider>
        <CreateLambdaForm formElementRef={{ current: null }} />
      </MockedProvider>,
    );

    const lambdaNameSelector = 'input#lambdaName';
    const lambdaNameInput = component.find(lambdaNameSelector);
    expect(lambdaNameInput.exists()).toEqual(true);
    expect(lambdaNameInput.instance().value).toEqual('');

    lambdaNameInput.instance().value = 'validname';
    expect(lambdaNameInput.instance().value).toEqual('validname');

    expect(
      component
        .find('form')
        .instance()
        .checkValidity(),
    ).toEqual(true);
  });

  it('Does not allow to submit form with invalid lambda name', () => {
    const component = mount(
      <MockedProvider>
        <CreateLambdaForm formElementRef={{ current: null }} />
      </MockedProvider>,
    );

    const lambdaNameSelector = 'input#lambdaName';
    const lambdaNameInput = component.find(lambdaNameSelector);
    expect(lambdaNameInput.exists()).toEqual(true);
    expect(lambdaNameInput.instance().value).toEqual('');

    lambdaNameInput.instance().value = '1invalidName';
    expect(lambdaNameInput.instance().value).toEqual('1invalidName');

    expect(
      component
        .find('form')
        .instance()
        .checkValidity(),
    ).toEqual(false);
  });

  it('Creates lambda properly', async () => {
    const onError = jest.fn();
    const onCompleted = jest.fn();
    const ref = React.createRef();

    const gqlMock = [createLambdaSuccessfulMock()];

    const component = mount(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <CreateLambdaForm
          onError={onError}
          onCompleted={onCompleted}
          formElementRef={ref}
        />
      </MockedProvider>,
    );

    const lambdaNameSelector = 'input#lambdaName';
    const lambdaNameInput = component.find(lambdaNameSelector);
    lambdaNameInput.instance().value = 'testname';

    const form = component.find('form');
    form.simulate('submit');

    await componentUpdate(component);

    expect(gqlMock[0].result).toHaveBeenCalled();

    expect(onCompleted).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('Shows error notification if an error occured', async () => {
    const onError = jest.fn();
    const onCompleted = jest.fn();
    const ref = React.createRef();

    const gqlMock = [createLambdaErrorMock()];

    const component = mount(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <CreateLambdaForm
          onError={onError}
          onCompleted={onCompleted}
          formElementRef={ref}
        />
      </MockedProvider>,
    );

    const lambdaNameSelector = 'input#lambdaName';
    const lambdaNameInput = component.find(lambdaNameSelector);
    lambdaNameInput.instance().value = 'testname';

    const form = component.find('form');
    form.simulate('submit');

    await componentUpdate(component);

    expect(onCompleted).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
  });
});
