import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'styled-components-grid';

import Spinner from '../../Spinner';

import TableRow from './Row';

import { TableContentWrapper, NotFoundMessage } from './components';

class TableContent extends React.Component {
  static propTypes = {
    columnsData: PropTypes.arrayOf(PropTypes.object).isRequired,
    elements: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool.isRequired,
    notFoundMessage: PropTypes.string,
  };

  static defaultProps = {
    notFoundMessage: 'Missing data',
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { columnsData, elements, loading, notFoundMessage } = this.props;

    if (loading) {
      return (
        <TableContentWrapper>
          <Spinner padding="20px" size="30px" color="rgba(50,54,58,0.6)" />
        </TableContentWrapper>
      );
    }

    return (
      <TableContentWrapper>
        {elements && elements.length > 0 ? (
          elements.map((element, index) => (
            <TableRow key={index} columnsData={columnsData} element={element} />
          ))
        ) : (
          <NotFoundMessage>{notFoundMessage}</NotFoundMessage>
        )}
      </TableContentWrapper>
    );
  }
}

export default TableContent;
