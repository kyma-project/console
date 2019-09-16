import React from 'react';
import PropTypes from 'prop-types';
import './LogTable.scss';

LogTable.propTypes = {
  entityName: PropTypes.string,
  entries: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default function LogTable({ entityName, entries }) {
  function renderEntries() {
    return entries.map(entry => (
      <tr key={entry.timestamp}>
        <td className="caption-muted">{entry.timestamp}</td>
        <td className="caption-muted">{entry.log}</td>
      </tr>
    ));
  }

  const title = entityName ? `Logs for ${entityName}` : 'Log stream';

  return (
    <table className="fd-table fd-has-margin-regular">
      <thead>
        <tr>
          <th colSpan="2" className="log-table__pre-header fd-has-type-0">
            {title}
          </th>
        </tr>
        <tr>
          <th className="caption-muted">Timestamp</th>
          <th className="caption-muted">Log</th>
        </tr>
      </thead>
      <tbody>
        {!!entries.length ? (
          renderEntries()
        ) : (
          <tr>
            <td colSpan="2" className="log-table__no-entries-text">
              No entries
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
