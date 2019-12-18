import React from 'react';
import ServicesDropdown from '../ServicesDropdown';
import { service1, service2 } from '../../../../../testing/servicesMocks';
import { render, queryAllByRole } from '@testing-library/react';

const services = [
  {
    name: 'addon-controller-metrics',
    ports: { port: 8080, __typename: 'ServicePort' },
    __typename: 'Service',
  },
];

describe('ServicesDropdown', () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation();
  const ref = React.createRef();

  it('Show loading', async () => {
    const { queryByText } = render(
      <ServicesDropdown
        _ref={ref}
        error={undefined}
        loading={true}
        data={[]}
      />,
    );

    expect(queryByText('Loading services...')).toBeTruthy();
  });

  it('Show error', async () => {
    const { queryByText } = render(
      <ServicesDropdown
        _ref={ref}
        error={new Error('Error')}
        loading={false}
        data={[]}
      />,
    );
    expect(queryByText("Couldn't load services list Error")).toBeTruthy();
  });

  it('Show service with one port', async () => {
    const { queryByText, queryAllByRole, debug } = render(
      <ServicesDropdown
        _ref={ref}
        error={undefined}
        loading={false}
        data={{ services: [service1] }}
      />,
    );
    debug();
    expect(queryAllByRole('menuitem')).toHaveLength(service1.ports.length);
    expect(
      queryByText(service1.name + ' (port: ' + service1.ports[0].port) + ')',
    ).toBeTruthy();
  });

  it('Show service with multiple ports', async () => {
    const { queryByText, queryAllByRole, debug } = render(
      <ServicesDropdown
        _ref={ref}
        error={undefined}
        loading={false}
        data={{ services: [service2] }}
      />,
    );
    debug();
    expect(queryAllByRole('menuitem')).toHaveLength(service2.ports.length);
    expect(
      queryByText(service2.name + ' (port: ' + service2.ports[0].port) + ')',
    ).toBeTruthy();
    expect(
      queryByText(service2.name + ' (port: ' + service2.ports[1].port) + ')',
    ).toBeTruthy();
  });

  it('Show multiple services', async () => {
    const { queryByText, queryAllByRole, debug } = render(
      <ServicesDropdown
        _ref={ref}
        error={undefined}
        loading={false}
        data={{ services: [service1, service2] }}
      />,
    );
    debug();
    expect(queryAllByRole('menuitem')).toHaveLength(
      service1.ports.length + service2.ports.length,
    );
    expect(
      queryByText(service1.name + ' (port: ' + service1.ports[0].port) + ')',
    ).toBeTruthy();
    expect(
      queryByText(service2.name + ' (port: ' + service2.ports[0].port) + ')',
    ).toBeTruthy();
    expect(
      queryByText(service2.name + ' (port: ' + service2.ports[1].port) + ')',
    ).toBeTruthy();
  });

  afterEach(() => {
    consoleError.mockClear();
  });

  afterAll(() => {
    consoleError.mockRestore();
  });
});
