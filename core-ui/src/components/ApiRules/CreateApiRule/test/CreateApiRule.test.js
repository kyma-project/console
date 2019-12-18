import React from 'react';
import CreateApiRule from '../CreateApiRule';
import { render, act } from '@testing-library/react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import {
  servicesQuery,
  createApiRuleMutation,
} from '../../../../testing/queriesMocks';
import { componentUpdate } from '../../../../testing';
jest.mock('@kyma-project/common', () => ({
  getApiUrl: () => 'kyma.local',
}));

jest.mock('@kyma-project/luigi-client', () => ({
  getEventData: () => ({
    environmentId: 'test',
  }),
}));

describe('CreateApiRule', () => {
  // const consoleError = jest.spyOn(console, 'error').mockImplementation();

  it('Renders basic component', async () => {
    const { queryByText, queryAllByRole, getAllByLabelText } = render(
      <MockedProvider mocks={[servicesQuery]}>
        <CreateApiRule />
      </MockedProvider>,
    );

    await wait();

    expect(queryByText('Create API Rule')).toBeInTheDocument();
    expect(queryByText('General settings')).toBeInTheDocument();
    expect(queryAllByRole('input')).toHaveLength(2);
    expect(queryAllByRole('select')).toHaveLength(1);
    expect(getAllByLabelText('option')).toHaveLength(3);

    expect(queryByText('Access strategies')).toBeInTheDocument();
    expect(queryAllByRole('row')).toHaveLength(1);
  });

  describe('Form validation', () => {
    let queryByPlaceholderText;

    beforeAll(() => {
      const renderResult = render(
        <MockedProvider mocks={[servicesQuery]}>
          <CreateApiRule />
        </MockedProvider>,
      );
      queryByPlaceholderText = renderResult.queryByPlaceholderText;
    });

    const nameInput = queryByPlaceholderText('API Rule name');

    const hostnameInput = queryByPlaceholderText('Enter the hostname');

    // it('Form inputs are rendered', () => {
    //   expect(nameInput).toBeInTheDocument();
    //   expect(hostnameInput).toBeInTheDocument();
    // });
  });

  xit('Does not allow to create if no name or hostname', async () => {
    const nameInput = queryByPlaceholderText('API Rule name');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput.value).toBe('');

    const hostnameInput = queryByPlaceholderText('Enter the hostname');
    expect(hostnameInput).toBeInTheDocument();
    expect(hostnameInput.value).toBe('');

    expect(queryByLabelText('submit-form')).toBeDisabled();
  });

  xit('Does not allow to create if invalid name', async () => {
    const component = mount(
      <MockedProvider mocks={[servicesQuery]}>
        <CreateApiRule />
      </MockedProvider>,
    );

    const nameInput = component.find('input#apiRuleName');
    nameInput.instance().value = 'test-';
    expect(nameInput.instance().value).toEqual('test-');

    const hostname = component.find('input#hostname');
    hostname.instance().value = 'host';
    expect(hostname.instance().value).toEqual('host');

    expect(
      component
        .find('form')
        .instance()
        .checkValidity(),
    ).toEqual(false);
  });

  xit('Does not allow to create if invalid host', async () => {
    const component = mount(
      <MockedProvider mocks={[servicesQuery]}>
        <CreateApiRule />
      </MockedProvider>,
    );

    const nameInput = component.find('input#apiRuleName');
    nameInput.instance().value = 'test';
    expect(nameInput.instance().value).toEqual('test');

    const hostname = component.find('input#hostname');
    hostname.instance().value = 'host123';
    expect(hostname.instance().value).toEqual('host123');

    expect(
      component
        .find('form')
        .instance()
        .checkValidity(),
    ).toEqual(false);
  });

  xit('Create button fires createApiRuleMutation', async () => {
    const component = mount(
      <MockedProvider mocks={[servicesQuery, createApiRuleMutation]}>
        <CreateApiRule />
      </MockedProvider>,
    );

    await componentUpdate(component);

    const nameInput = component.find('input#apiRuleName');
    nameInput.instance().value = 'test';
    nameInput.simulate('change');
    expect(nameInput.instance().value).toEqual('test');

    const hostname = component.find('input#hostname');
    hostname.instance().value = 'host';
    hostname.simulate('change');
    expect(hostname.instance().value).toEqual('host');

    expect(
      component
        .find('form')
        .instance()
        .checkValidity(),
    ).toEqual(true);

    const createButton = component.findWhere(
      t => t.type() == 'button' && t.text() === 'Create',
    );

    await createButton.simulate('click');
    await componentUpdate(component);

    expect(createApiRuleMutation.result).toHaveBeenCalled();
  });

  // afterEach(() => {
  //   consoleError.mockClear();
  // });

  // afterAll(() => {
  //   consoleError.mockRestore();
  // });
});
