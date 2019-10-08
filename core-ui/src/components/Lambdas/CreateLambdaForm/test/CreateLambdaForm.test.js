import React from 'react';
import CreateLambdaForm from '../CreateLambdaForm';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

describe('CreateLambdaForm', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <CreateLambdaForm formElementRef={{ current: null }} />,
    );

    expect(component).toBeTruthy();
  });

  it('Shows empty lambda name input, predefined dropdowns and does not allow to submit form', () => {
    const component = mount(
      <CreateLambdaForm formElementRef={{ current: null }} />,
    );

    const lambdaNameSelector = '#lambdaName';
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
      <CreateLambdaForm formElementRef={{ current: null }} />,
    );

    const lambdaNameSelector = '#lambdaName';
    const lambdaNameInput = component.find(lambdaNameSelector);
    expect(lambdaNameInput.exists()).toEqual(true);
    expect(lambdaNameInput.instance().value).toEqual('');

    lambdaNameInput.instance().value = 'validName';
    expect(lambdaNameInput.instance().value).toEqual('validName');

    expect(
      component
        .find('form')
        .instance()
        .checkValidity(),
    ).toEqual(true);
  });

  it('Does not allow to submit form with invalid lambda name', () => {
    const component = mount(
      <CreateLambdaForm formElementRef={{ current: null }} />,
    );

    const lambdaNameSelector = '#lambdaName';
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
});
