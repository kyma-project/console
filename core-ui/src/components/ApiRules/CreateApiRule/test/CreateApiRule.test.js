import React from 'react';
import CreateApiRule from '../CreateApiRule';

import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import { servicesQuery } from '../../../../testing/queriesMocks';
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
  const consoleError = jest.spyOn(console, 'error').mockImplementation();
  it('Renders basic component', async () => {
    const { queryByText, queryAllByRole, debug } = render(
      <MockedProvider>
        <CreateApiRule />
      </MockedProvider>,
    );

    expect(queryByText('Create API Rule')).toBeTruthy();
    expect(queryByText('General settings')).toBeTruthy();
    expect(queryAllByRole('input')).toHaveLength(2);
    expect(queryAllByRole('select')).toHaveLength(0);

    expect(queryByText('Access strategies')).toBeTruthy();
    expect(queryAllByRole('row')).toHaveLength(1);

    expect(consoleError.mock.calls).toMatchSnapshot();
  });

  it('Renders services in dropdown', async () => {
    const component = mount(
      <MockedProvider mocks={[servicesQuery]}>
        <CreateApiRule />
      </MockedProvider>,
    );
    await componentUpdate(component);

    const services = component.find('[role="select-option"]');
    expect(services).toHaveLength(3);

    expect(consoleError.mock.calls).toMatchSnapshot();
  });

  afterEach(() => {
    consoleError.mockClear();
  });

  afterAll(() => {
    consoleError.mockRestore();
  });
});
