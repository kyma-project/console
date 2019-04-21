import React, { useContext } from 'react';
import { Spinner } from '@kyma-project/react-components';

import TableComponent from './Table.component';
import TableContentComponent from './TableContent.component';

import { QueriesService, ConfigurationsService, FiltersService } from '../../services';

import { ErrorWrapper } from './styled';

import { Configuration } from '../../types';
import { CONTENT_HEADERS, ERRORS } from '../../constants';

const TableContainer: React.FunctionComponent = () => {
  const { addonsConfigurations, error, loading = true } = useContext(
    QueriesService,
  );
  const { configurationsExist, filteredConfigs } = useContext(
    ConfigurationsService,
  );
  const {
    setFilterLabel,
    activeFilters: { search },
  } = useContext(FiltersService);

  const content = () => {
    if (loading) {
      return <Spinner />;
    }
    if (!configurationsExist()) {
      return <ErrorWrapper>{ERRORS.RESOURCES_NOT_FOUND}</ErrorWrapper>;
    }
    if (error) {
      return <ErrorWrapper>{ERRORS.SERVER}</ErrorWrapper>;
    }
    if (!(filteredConfigs && filteredConfigs.length) && search) {
      return <ErrorWrapper>{ERRORS.NOT_MATCHING_FILTERS}</ErrorWrapper>;
    }
    return (
      <TableContentComponent
        headers={CONTENT_HEADERS}
        configs={filteredConfigs}
        setFilterLabel={setFilterLabel}
      />
    );
  };

  return (
    <TableComponent configurationsExist={configurationsExist()}>
      {content()}
    </TableComponent>
  );
};

export default TableContainer;
