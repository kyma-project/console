import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'styled-components-grid';

import {
  TableHeaderWrapper,
  TableHeaderTitle,
  TableHeaderAdditionalContent,
  TableHeaderColumnsWrapper,
  TableHeaderColumnName,
} from './components';

class TableHeader extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    addContent: PropTypes.any,
    columns: PropTypes.arrayOf(PropTypes.object),
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { title, addContent, columns } = this.props;

    return (
      <TableHeaderWrapper>
        <Grid>
          <Grid.Unit size={0.4}>
            <TableHeaderTitle>{title}</TableHeaderTitle>
          </Grid.Unit>
          <Grid.Unit size={0.6}>
            <TableHeaderAdditionalContent>
              {addContent}
            </TableHeaderAdditionalContent>
          </Grid.Unit>
        </Grid>
        <TableHeaderColumnsWrapper data-e2e-id={'instances-header'}>
          <Grid>
            {columns &&
              columns.map(column => (
                <Grid.Unit key={column.name} size={column.size}>
                  <TableHeaderColumnName>{column.name}</TableHeaderColumnName>
                </Grid.Unit>
              ))}
          </Grid>
        </TableHeaderColumnsWrapper>
      </TableHeaderWrapper>
    );
  }
}

export default TableHeader;
