import React from 'react';
import { render, wait } from '@testing-library/react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import { componentUpdate } from '../../../../testing';

import RegisterApplicationForm from '../RegisterApplicationForm';
import {
  checkApplicationExistMock,
  registerApplicationSuccessfulMock,
  registerApplicationErrorMock,
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

jest.mock('index', () => {
  return {
    CompassGqlContext: {},
  };
});
describe('RegisterApplicationForm', () => {
  it('Form inputs are rendered', async () => {
    const { queryByPlaceholderText, getByText } = render(
      <MockedProvider>
        <RegisterApplicationForm formElementRef={{ current: null }} />
      </MockedProvider>,
    );

    const nameInput = queryByPlaceholderText('Name of the application');
    const providerInput = queryByPlaceholderText(
      'Name of the application provider',
    );
    const descriptionInput = queryByPlaceholderText(
      'Description of the Application',
    );

    await wait(() => {
      expect(nameInput).toBeInTheDocument();
      expect(providerInput).toBeInTheDocument();
      expect(descriptionInput).toBeInTheDocument();
      expect(getByText(/^Name/i)).toBeInTheDocument();
      expect(getByText(/^Provider Name/i)).toBeInTheDocument();
      expect(getByText(/^Description/i)).toBeInTheDocument();
    });
  });

  it('Shows empty application name, provider name and description input and does not allow to submit form', async () => {
    const component = mount(
      <MockedProvider>
        <RegisterApplicationForm formElementRef={{ current: null }} />
      </MockedProvider>,
    );

    await componentUpdate(component);
    await componentUpdate(component);

    const applicationNameSelector = 'input#applicationName';
    const applicationNameInput = component.find(applicationNameSelector);
    expect(applicationNameInput.exists()).toEqual(true);
    expect(applicationNameInput.instance().value).toEqual('');

    const providerNameSelector = '#providerName';
    const providerNameInput = component.find(providerNameSelector);
    expect(providerNameInput.exists()).toEqual(true);
    expect(providerNameInput.instance().value).toEqual('');

    const descriptionSelector = '#description';
    const descriptionInput = component.find(descriptionSelector);
    expect(descriptionInput.exists()).toEqual(true);
    expect(descriptionInput.instance().value).toEqual('');

    expect(
      component
        .find('form')
        .instance()
        .checkValidity(),
    ).toEqual(false);
  });

  it('Allows to submit form with valid application name', async () => {
    const component = mount(
      <MockedProvider>
        <RegisterApplicationForm formElementRef={{ current: null }} />
      </MockedProvider>,
    );

    await componentUpdate(component);
    await componentUpdate(component);

    const applicationNameSelector = 'input#applicationName';
    const applicationNameInput = component.find(applicationNameSelector);
    expect(applicationNameInput.exists()).toEqual(true);
    expect(applicationNameInput.instance().value).toEqual('');

    applicationNameInput.instance().value = 'validname';
    expect(applicationNameInput.instance().value).toEqual('validname');

    expect(
      component
        .find('form')
        .instance()
        .checkValidity(),
    ).toEqual(true);
  });

  it('Does not allow to submit form with invalid application name', async () => {
    const component = mount(
      <MockedProvider>
        <RegisterApplicationForm formElementRef={{ current: null }} />
      </MockedProvider>,
    );

    await componentUpdate(component);
    await componentUpdate(component);

    const applicationNameSelector = 'input#applicationName';
    const applicationNameInput = component.find(applicationNameSelector);
    expect(applicationNameInput.exists()).toEqual(true);
    expect(applicationNameInput.instance().value).toEqual('');

    applicationNameInput.instance().value = '1invalidName';
    expect(applicationNameInput.instance().value).toEqual('1invalidName');

    expect(
      component
        .find('form')
        .instance()
        .checkValidity(),
    ).toEqual(false);
  });

  it('Creates application properly', async () => {
    const onError = jest.fn();
    const onCompleted = jest.fn();
    const ref = React.createRef();

    const gqlMock = [registerApplicationSuccessfulMock()];

    const component = mount(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <RegisterApplicationForm
          onError={onError}
          onCompleted={onCompleted}
          formElementRef={ref}
        />
      </MockedProvider>,
    );

    await componentUpdate(component);
    await componentUpdate(component);

    const applicationNameSelector = 'input#applicationName';
    const applicationNameInput = component.find(applicationNameSelector);
    applicationNameInput.instance().value = 'testname';

    await componentUpdate(component);
    await componentUpdate(component);
    const form = component.find('form');
    form.simulate('submit');

    await componentUpdate(component);
    await componentUpdate(component);

    expect(gqlMock[0].result).toHaveBeenCalled();

    expect(onCompleted).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('Shows error notification if an error occured', async () => {
    const onError = jest.fn();
    const onCompleted = jest.fn();
    const ref = React.createRef();

    const gqlMock = [registerApplicationErrorMock()];

    const component = mount(
      <MockedProvider mocks={gqlMock} addTypename={false}>
        <RegisterApplicationForm
          onError={onError}
          onCompleted={onCompleted}
          formElementRef={ref}
        />
      </MockedProvider>,
    );

    await componentUpdate(component);
    await componentUpdate(component);

    const applicationNameSelector = 'input#applicationName';
    const applicationNameInput = component.find(applicationNameSelector);
    applicationNameInput.instance().value = 'testname';

    const form = component.find('form');
    form.simulate('submit');

    await componentUpdate(component);
    await componentUpdate(component);

    expect(onCompleted).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
  });
});
