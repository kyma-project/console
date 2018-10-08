import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'styled-components-grid';

import { TableCell } from './components';

class TableRow extends React.Component {
  static propTypes = {
    columnsData: PropTypes.arrayOf(PropTypes.object).isRequired,
    element: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { columnsData, element } = this.props;

    const renderRow = element
      ? columnsData.map((column, index) => (
          <Grid.Unit key={index} size={column.size}>
            <TableCell>{column.accesor(element)}</TableCell>
          </Grid.Unit>
        ))
      : null;

    return <Grid>{renderRow}</Grid>;
  }
}

export default TableRow;
