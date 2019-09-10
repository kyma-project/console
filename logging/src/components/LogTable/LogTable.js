import React from 'react';
import './LogTable.scss';

export default function(props) {
  const sampleEntries = [
    {
      timestamp: '14:14:01.384196009Z',
      log: 'a',
    },
    {
      timestamp: '14:14:01.384196009Z++',
      log: `[2019-06-11 11:58:00.047][15][warning][misc] [external/envoy/source/common/protobuf/utility.cc:174] 
      Using deprecated option 'envoy.api.v2.Listener.use_original_dst' from file lds.proto. This configuration will be removed from 
      Envoy soon. Please see https://www.envoyproxy.io/docs/envoy/latest/intro/deprecated for details.`,
    },
    {
      timestamp: 3,
      log: 'c',
    },
  ];

  function renderEntries() {
    return sampleEntries.map(entry => (
      <tr key={entry.timestamp}>
        <td className="caption-muted">{entry.timestamp}</td>
        <td className="caption-muted">{entry.log}</td>
      </tr>
    ));
  }

  return (
    <table className="fd-table fd-has-margin-regular">
      <thead>
        <tr>
          <th colSpan="2" className="log-table__pre-header fd-has-type-0">
            Stream Name
          </th>
        </tr>
        <tr>
          <th className="caption-muted">Timestamp</th>
          <th className="caption-muted">Log</th>
        </tr>
      </thead>
      <tbody>{renderEntries()}</tbody>
    </table>
  );
}
