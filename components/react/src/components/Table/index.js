import React from 'react';
import PropTypes from 'prop-types';

import Spinner from '../Spinner';

import {
  TableWrapper,
  TableHeader,
  TableHeaderHead,
  TableHeaderActions,
  TableBody,
  TableContent,
  NotFoundMessage,
} from './styled';

const Table = ({
  title,
  addHeaderContent,
  headers,
  tableData,
  loadingData,
  notFoundMessage,
}) => {
  return (
    <TableWrapper>
      {title && (
        <TableHeader>
          <TableHeaderHead title={title} />
          <TableHeaderActions>{addHeaderContent}</TableHeaderActions>
        </TableHeader>
      )}
      <TableBody>
        <TableContent headers={headers} tableData={tableData} />
        {loadingData && <Spinner />}
        {!loadingData && !(tableData && tableData.length) ? (
          <NotFoundMessage>{notFoundMessage}</NotFoundMessage>
        ) : null}
      </TableBody>
    </TableWrapper>
  );
};

Table.defaultProps = {
  loadingData: false,
  notFoundMessage: 'Not found resources',
};

Table.propTypes = {
  title: PropTypes.string,
  addHeaderContent: PropTypes.any,
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
  loadingData: PropTypes.bool,
  notFoundMessage: PropTypes.string,
};

export default Table;
