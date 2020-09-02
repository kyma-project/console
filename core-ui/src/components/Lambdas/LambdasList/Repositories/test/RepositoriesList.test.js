import React from 'react';
import { render, wait } from '@testing-library/react';

import { repositoryMock } from 'components/Lambdas/helpers/testing';

import RepositoriesList from '../RepositoriesList';

import { ERRORS } from '../../../constants';

jest.mock('@luigi-project/client', () => {
  return {
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

describe('RepositoriesList', () => {
  it('should render Spinner if functions is fetching from server', async () => {
    const { getByLabelText } = render(
      <RepositoriesList serverDataLoading={true} />,
    );

    expect(getByLabelText('Loading')).toBeInTheDocument();
    await wait();
  });

  it('should render error text if error appeared from server', async () => {
    const { getByText } = render(<RepositoriesList serverDataError={true} />);

    expect(getByText(ERRORS.SERVER)).toBeInTheDocument();
    await wait();
  });

  it('should render table with data', async () => {
    const { queryByRole, queryAllByRole } = render(
      <RepositoriesList
        serverDataLoading={true}
        repositories={[repositoryMock]}
      />,
    );

    await wait(() => {
      const table = queryByRole('table');
      expect(table).toBeInTheDocument();
      expect(queryAllByRole('row')).toHaveLength(2); // header + 1 element;
    });
  });
});
