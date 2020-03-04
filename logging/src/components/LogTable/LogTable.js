import React from 'react';
import PropTypes from 'prop-types';
import './LogTable.scss';

LogTable.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default function LogTable({ entries }) {
  const Entries = () => {
    return entries.map(entry => {
      let entryLog;
      try {
        entryLog = JSON.parse(entry.log).log;
      } catch (e) {
        entryLog = entry.log;
      }
      return (
        <tr key={entry.timestamp}>
          <td className="caption-muted">{entry.timestamp}</td>
          <td className="caption-muted">{entryLog}</td>
        </tr>
      );
    });
  };

  return (
    <table className="fd-table fd-has-margin-regular">
      <thead>
        <tr>
          <th className="caption-muted">Timestamp</th>
          <th className="caption-muted">Log</th>
        </tr>
      </thead>
      <tbody>
        {!!entries.length ? (
          <Entries />
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
