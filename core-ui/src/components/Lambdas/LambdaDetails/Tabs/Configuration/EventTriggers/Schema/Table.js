import React from 'react';

import { bemClasses } from '../../../../../helpers/misc';

const classes = {
  table: bemClasses.element(`table`),
  tableBody: bemClasses.element(`table-body`),
  tableHeader: bemClasses.element(`table-header`),
  tableHeaderTitle: bemClasses.element(`table-header-title`),
  tableHeaderColumns: bemClasses.element(`table-header-columns`),
  tableHeaderColumn: bemClasses.element(`table-header-column`),
  tableRow: bemClasses.element(`table-row`),
  tableCell: bemClasses.element(`table-cell`),
};

export const Table = ({ header, rows = [], accessors = [], children }) => {
  if (!children && !rows.length) {
    return null;
  }

  const tableBody = children
    ? children
    : rows.map((row, index) => (
        <TableRow {...row} key={index} accessors={row.accessors || accessors} />
      ));

  return (
    <table className={classes.table}>
      <TableHeader {...header} />
      <tbody className={classes.tableBody}>{tableBody}</tbody>
    </table>
  );
};

export const TableHeader = ({ title = '', columns = [] }) => {
  if (!columns) {
    return null;
  }

  return (
    <thead className={classes.tableHeader}>
      {!title ? null : (
        <tr className={classes.tableHeaderTitle}>
          <td colSpan={columns.length}>{title}</td>
        </tr>
      )}
      <tr className={classes.tableHeaderColumns}>
        {columns.map((column, index) => (
          <th key={index} className={classes.tableHeaderColumn}>
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export const TableRow = ({
  element,
  rootKey = '',
  accessors = [],
  className = '',
}) => {
  const renderRowByAccessors = (acs, el) =>
    acs.map((accessor, index) => (
      <td key={index} className={classes.tableCell}>
        {resolveAccessor(accessor, el)}
      </td>
    ));

  const resolveAccessor = (accessor, el) => {
    if (accessor instanceof Function) {
      return accessor(el);
    }

    const value = el[accessor];
    if (typeof value === 'boolean' || typeof value === 'number') {
      return value.toString();
    }
    return value;
  };

  const content =
    accessors && accessors.length
      ? renderRowByAccessors(accessors, element)
      : element;

  return (
    <tr
      key={rootKey}
      className={bemClasses.concatenate([classes.tableRow, className])}
    >
      {content}
    </tr>
  );
};
