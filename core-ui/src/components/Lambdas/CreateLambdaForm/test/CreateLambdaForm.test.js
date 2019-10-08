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

  it('Shows lambda name input and size and runtime dropdowns', () => {
    const component = mount(
      <CreateLambdaForm formElementRef={{ current: null }} />,
    );

    const lambdaName = '#lambdaName';
    expect(component.find(lambdaName).exists()).toEqual(true);
    expect(component.find(lambdaName).props().value).toEqual(undefined);

    const lambdaSize = '#lambdaSize';
    expect(component.find(lambdaSize).exists()).toEqual(true);
    expect(component.find(lambdaSize).props().value).toEqual(undefined);
    expect(component.find(lambdaSize).props().defaultValue).toEqual('S');
    expect(component.find(lambdaSize).props().children.length).toEqual(3);

    const lambdaRuntime = '#lambdaRuntime';
    expect(component.find(lambdaRuntime).exists()).toEqual(true);
    expect(component.find(lambdaRuntime).props().value).toEqual(undefined);
    expect(component.find(lambdaRuntime).props().defaultValue).toEqual(
      'nodejs6',
    );
    expect(component.find(lambdaRuntime).props().children.length).toEqual(2);

    expect(
      component
        .find('form')
        .instance()
        .checkValidity(),
    ).toEqual(false);
  });

  // it('Shows and hides Container limits section', () => {
  //   const component = mount(
  //     <CreateLambdaForm formElementRef={{ current: null }} />,
  //   );

  //   const containerLimitsCheckbox = '#container-limits';
  //   const containerLimitsSection = `[data-test-id="container-limits-section"]`;

  //   expect(component.find(containerLimitsSection).exists()).toEqual(false);

  //   component
  //     .find(containerLimitsCheckbox)
  //     .simulate('change', { target: { checked: true } });

  //   expect(component.find(containerLimitsSection).exists()).toEqual(true);

  //   component
  //     .find(containerLimitsCheckbox)
  //     .simulate('change', { target: { checked: false } });
  //   expect(component.find(containerLimitsSection).exists()).toEqual(false);

  //   expect(
  //     component
  //       .find('form')
  //       .instance()
  //       .checkValidity(),
  //   ).toEqual(false);
  // });
});
