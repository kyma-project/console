import React, { useContext } from 'react';
import { Spinner } from '@kyma-project/react-components';

import TableComponent from './Table.component';
import TableContentComponent from './TableContent.component';

import QueriesService from '../../services/Queries.service';
import ConfigurationsService from '../../services/Configurations.service';
import FiltersService from '../../services/Filters.service';

import { ErrorWrapper } from './styled';

import { Configuration } from '../../types';
import { CONTENT_HEADERS, ERRORS } from '../../constants';

const TableContainer: React.FunctionComponent = () => {
  const { addonsConfigurations, error, loading = true } = useContext(
    QueriesService.Context,
  );
  const { configurationsExist, filteredConfigs } = useContext(
    ConfigurationsService.Context,
  );
  const {
    setFilterLabel,
    activeFilters: { search },
  } = useContext(FiltersService.Context);

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
