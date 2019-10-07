import React from 'react';
import CreateNamespaceForm from '../CreateNamespaceForm';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

describe('CreateNamespaceForm', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <CreateNamespaceForm formElementRef={{ current: null }} />,
    );

    expect(component).toBeTruthy();
  });

  it('Shows and hides Memory quotas section', () => {
    const component = mount(
      <CreateNamespaceForm formElementRef={{ current: null }} />,
    );

    const memoryQuotasCheckbox = '#memory-quotas';
    const memoryQuotasSection = `[data-test-id="memory-quotas-section"]`;

    expect(component.find(memoryQuotasSection).exists()).toEqual(false);

    component
      .find(memoryQuotasCheckbox)
      .simulate('change', { target: { checked: true } });
    expect(component.find(memoryQuotasSection).exists()).toEqual(true);

    component
      .find(memoryQuotasCheckbox)
      .simulate('change', { target: { checked: false } });
    expect(component.find(memoryQuotasSection).exists()).toEqual(false);
  });

  it('Shows and hides Container limits section', () => {
    const component = mount(
      <CreateNamespaceForm formElementRef={{ current: null }} />,
    );

    const containerLimitsCheckbox = '#container-limits';
    const containerLimitsSection = `[data-test-id="container-limits-section"]`;

    expect(component.find(containerLimitsSection).exists()).toEqual(false);

    component
      .find(containerLimitsCheckbox)
      .simulate('change', { target: { checked: true } });

    expect(component.find(containerLimitsSection).exists()).toEqual(true);

    component
      .find(containerLimitsCheckbox)
      .simulate('change', { target: { checked: false } });
    expect(component.find(containerLimitsSection).exists()).toEqual(false);

    expect(
      component
        .find('form')
        .instance()
        .checkValidity(),
    ).toEqual(false);
  });
});
