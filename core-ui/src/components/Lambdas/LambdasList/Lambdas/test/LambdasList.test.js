import React from 'react';
import { render, wait } from '@testing-library/react';

import { lambdaMock } from 'components/Lambdas/helpers/testing';

import LambdasList from '../LambdasList';

import { ERRORS } from '../../../constants';

jest.mock('@luigi-project/client', () => {
  return {
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

describe('LambdasList', () => {
  it('should render Spinner if functions is fetching from server', async () => {
    const { getByLabelText } = render(<LambdasList serverDataLoading={true} />);

    expect(getByLabelText('Loading')).toBeInTheDocument();
    await wait();
  });

  it('should render error text if error appeared from server', async () => {
    const { getByText } = render(<LambdasList serverDataError={true} />);

    expect(getByText(ERRORS.SERVER)).toBeInTheDocument();
    await wait();
  });

  it('should render table with data', async () => {
    const { queryByRole, queryAllByRole } = render(
      <LambdasList serverDataLoading={true} lambdas={[lambdaMock]} />,
    );

    await wait(() => {
      const table = queryByRole('table');
      expect(table).toBeInTheDocument();
      expect(queryAllByRole('row')).toHaveLength(2); // header + 1 element;
    });
  });
});
