import React from 'react';
import { Button } from 'fundamental-react';
import DeleteUrlModal from './../../Modals/DeleteUrlModal/DeleteUrlModal.container';
import { RepositoryStatus, RepositoryAddon } from '../../../types';

import * as ReactShared from '../../../react-shared';

interface RepositoryTableHeaderProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  repository: RepositoryStatus;
  configName: string;
}

const RepositoryTableHeader: React.FunctionComponent<RepositoryTableHeaderProps> = ({
  isOpen,
  setIsOpen,
  repository,
  configName,
}) => (
  <tr>
    <th>
      <Button
        glyph={isOpen ? 'navigation-up-arrow' : 'navigation-down-arrow'}
        option="light"
        onClick={() => setIsOpen(!isOpen)}
        disabled={!repository.addons.length}
      />
    </th>
    <th>{repository.url}</th>
    <th />
    <th>
      <ReactShared.StatusBadge
        autoResolveType={true}
        status={repository.status}
      >
        {repository.message}
      </ReactShared.StatusBadge>
    </th>
    <th>
      {<DeleteUrlModal url={repository.url} configurationName={configName} />}
    </th>
  </tr>
);

interface RepositoryTableRowProps {
  addon: RepositoryAddon;
}

const RepositoryTableRow: React.FunctionComponent<RepositoryTableRowProps> = ({
  addon,
}) => (
  <tr>
    <td />
    <td className="addon-table-padded">{addon.name}</td>
    <td>{addon.version}</td>
    <td>
      <ReactShared.StatusBadge autoResolveType={true} status={addon.status}>
        {addon.message}
      </ReactShared.StatusBadge>
    </td>
    <td />
  </tr>
);

interface RepositoryTableSegmentProps {
  repository: RepositoryStatus;
  configName: string;
}

const RepositoryTableSegment: React.FunctionComponent<RepositoryTableSegmentProps> = ({
  repository,
  configName,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <tbody>
      <RepositoryTableHeader
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        repository={repository}
        configName={configName}
      />
      {isOpen &&
        repository.addons.map((addon: RepositoryAddon) => (
          <RepositoryTableRow key={addon.name} addon={addon} />
        ))}
    </tbody>
  );
};

export default RepositoryTableSegment;
