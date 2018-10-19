import React from 'react';
import PropTypes from 'prop-types';

import { TableWrapper } from './components';
import TableHeader from './TableHeader';
import TableContent from './TableContent';
import TableFooter from './TableFooter';

class Table extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    addHeaderContent: PropTypes.any,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool,
    notFoundMessage: PropTypes.string,
  };

  static defaultProps = {
    loading: false,
    notFoundMessage: 'Not found resources',
  };

  constructor(props) {
    super(props);
  }

  extractHeaderData(columns) {
    let columnsData = [];
    columns.map(column => {
      columnsData.push({ size: column.size, name: column.name });
    });

    return columnsData;
  }

  render() {
    const {
      title,
      addHeaderContent,
      columns,
      data,
      loading,
      notFoundMessage,
      margin,
    } = this.props;

    return (
      <TableWrapper margin={margin}>
        <TableHeader
          title={title}
          addContent={addHeaderContent}
          columns={this.extractHeaderData(columns)}
        />
        <TableContent
          elements={data}
          columnsData={columns}
          loading={loading}
          notFoundMessage={notFoundMessage}
        />
      </TableWrapper>
    );
  }
}

export default Table;
