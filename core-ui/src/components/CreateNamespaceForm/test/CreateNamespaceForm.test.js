import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import { act } from 'react-dom/test-utils';
import wait from 'waait';

import { expectToSolveWithin } from '../../../setupTests';
import CreateNamespaceForm from '../CreateNamespaceForm';
import {
  createNamespaceSuccessfulMock,
  createResourceQuotaSuccessfulMock,
  createLimitRangeSuccessfulMock,
  createResourceQuotaErrorMock,
  createNamespaceErrorMock,
} from './gqlMocks';

describe('CreateNamespaceForm', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <MockedProvider>
        <CreateNamespaceForm formElementRef={{ current: null }} />
      </MockedProvider>,
    );

    expect(component).toBeTruthy();
  });

  it('Shows and hides Memory quotas section', () => {
    const component = mount(
      <MockedProvider>
        <CreateNamespaceForm formElementRef={{ current: null }} />
      </MockedProvider>,
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
      <MockedProvider>
        <CreateNamespaceForm formElementRef={{ current: null }} />
      </MockedProvider>,
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

  it('Makes Namespace creation request only, when no Limits/Quotas are provided', async () => {
    const onError = jest.fn();
    const onCompleted = jest.fn();
    const ref = React.createRef();

    const gqlMock = [
      createNamespaceSuccessfulMock(),
      createLimitRangeSuccessfulMock(),
      createResourceQuotaSuccessfulMock(),
    ];

    const component = mount(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <CreateNamespaceForm
          onError={onError}
          onCompleted={onCompleted}
          formElementRef={ref}
        />
      </MockedProvider>,
    );

    const form = component.find('form');
    form.simulate('submit');

    await act(async () => {
      await wait();
    });

    expect(gqlMock[0].result).toHaveBeenCalled();
    expect(gqlMock[1].result).not.toHaveBeenCalled();
    expect(gqlMock[2].result).not.toHaveBeenCalled();

    expect(onCompleted).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('Makes create Namespace, Limits, Quotas requests, when all are provided', async () => {
    const onError = jest.fn();
    const onCompleted = jest.fn();
    const ref = React.createRef();

    const gqlMock = [
      createNamespaceSuccessfulMock(),
      createLimitRangeSuccessfulMock(),
      createResourceQuotaSuccessfulMock(),
    ];

    const component = mount(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <CreateNamespaceForm
          onError={onError}
          onCompleted={onCompleted}
          formElementRef={ref}
        />
      </MockedProvider>,
    );

    const form = component.find('form');
    const containerLimitsCheckboxId = '#container-limits';
    const memoryQuotasCheckboxId = '#memory-quotas';

    const memoryQuotasCheckbox = component.find(memoryQuotasCheckboxId);
    memoryQuotasCheckbox.getDOMNode().checked = true;
    memoryQuotasCheckbox.simulate('change', { target: { checked: true } });

    const containerLimitsCheckbox = component.find(containerLimitsCheckboxId);
    containerLimitsCheckbox.getDOMNode().checked = true;
    containerLimitsCheckbox.simulate('change', { target: { checked: true } });

    form.simulate('submit');

    await act(async () => {
      await expectToSolveWithin(() => {
        expect(gqlMock[0].result).toHaveBeenCalled();
        expect(gqlMock[1].result).toHaveBeenCalled();
        expect(gqlMock[2].result).toHaveBeenCalled();
      }, 500);
    });

    expect(onCompleted).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('Shows warning, when Namespace was created, but Limit Range or Resource quota creation failed', async () => {
    const onError = jest.fn();
    const onCompleted = jest.fn();
    const ref = React.createRef();

    const gqlMock = [
      createNamespaceSuccessfulMock(),
      createResourceQuotaErrorMock(),
    ];

    const component = mount(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <CreateNamespaceForm
          onError={onError}
          onCompleted={onCompleted}
          formElementRef={ref}
        />
      </MockedProvider>,
    );

    const form = component.find('form');
    const memoryQuotasCheckboxId = '#memory-quotas';

    const memoryQuotasCheckbox = component.find(memoryQuotasCheckboxId);
    memoryQuotasCheckbox.getDOMNode().checked = true;
    memoryQuotasCheckbox.simulate('change', { target: { checked: true } });

    form.simulate('submit');

    await act(async () => {
      await wait(100);
    });

    expect(gqlMock[0].result).toHaveBeenCalled();
    expect(onCompleted).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      true,
    );
  });

  it('Exits with an error, and does not proceed with subsequent calls if create Namespace request failed', async () => {
    const onError = jest.fn();
    const onCompleted = jest.fn();
    const ref = React.createRef();

    const gqlMock = [
      createNamespaceErrorMock(),
      createResourceQuotaSuccessfulMock(),
    ];

    const component = mount(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <CreateNamespaceForm
          onError={onError}
          onCompleted={onCompleted}
          formElementRef={ref}
        />
      </MockedProvider>,
    );

    const form = component.find('form');
    const memoryQuotasCheckboxId = '#memory-quotas';

    const memoryQuotasCheckbox = component.find(memoryQuotasCheckboxId);
    memoryQuotasCheckbox.getDOMNode().checked = true;
    memoryQuotasCheckbox.simulate('change', { target: { checked: true } });

    form.simulate('submit');

    await act(async () => {
      await wait(100);
    });

    expect(onCompleted).not.toHaveBeenCalled();
    expect(gqlMock[1].result).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith('ERROR', expect.anything());
  });
});
