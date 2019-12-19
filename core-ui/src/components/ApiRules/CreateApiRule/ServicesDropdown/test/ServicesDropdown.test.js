import React from 'react';
import ServicesDropdown from '../ServicesDropdown';
import { service1, service2 } from '../../../../../testing/servicesMocks';
import { render } from '@testing-library/react';

describe('ServicesDropdown', () => {
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

    expect(queryByText('Loading services...')).toBeInTheDocument();
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
    expect(
      queryByText("Couldn't load services list Error"),
    ).toBeInTheDocument();
  });

  it('Show service with one port', async () => {
    const { getAllByLabelText } = render(
      <ServicesDropdown
        _ref={ref}
        loading={false}
        data={{ services: [service1] }}
      />,
    );

    expect(getAllByLabelText('option')).toMatchSnapshot();
  });

  it('Show service with multiple ports', async () => {
    const { getAllByLabelText } = render(
      <ServicesDropdown
        _ref={ref}
        loading={false}
        data={{ services: [service2] }}
      />,
    );
    expect(getAllByLabelText('option')).toMatchSnapshot();
  });

  it('Show multiple services', async () => {
    const { getAllByLabelText } = render(
      <ServicesDropdown
        _ref={ref}
        loading={false}
        data={{
          services: [service1, service2],
        }}
      />,
    );
    expect(getAllByLabelText('option')).toMatchSnapshot();
  });
});
