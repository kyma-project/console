import React from 'react';
import RepositoryTableSegment from './../RepositoryTableSegment/RepositoryTableSegment';
import { Configuration } from '../../../types';

interface AddonTableProps {
  config: Configuration;
}

const AddonTable: React.FunctionComponent<AddonTableProps> = ({ config }) => {
  const tableSegments = config.status.repositories.map(repository => (
    <RepositoryTableSegment
      key={repository.url}
      repository={repository}
      configName={config.name}
    />
  ));

  return (
    <table className="fd-table">
      <thead>
        <tr>
          <th />
          <th>URL</th>
          <th>Version</th>
          <th>Status</th>
          <th />
        </tr>
      </thead>
      {tableSegments}
    </table>
  );
};

export default AddonTable;
