import React, { FunctionComponent } from 'react';
import { Button, Icon, Popover } from 'fundamental-react';
import DeleteUrlModal from './../../Modals/DeleteUrlModal/DeleteUrlModal.container';
import { RepositoryStatus, RepositoryAddon } from '../../../types';
import classNames from 'classnames';

interface RepositoryTableHeaderProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  repository: RepositoryStatus;
  configName: string;
}

const RepositoryTableHeader: FunctionComponent<RepositoryTableHeaderProps> = ({
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
      <StatusWithMessage
        status={repository.status}
        message={repository.message}
      />
    </th>
    <th>
      {<DeleteUrlModal url={repository.url} configurationName={configName} />}
    </th>
  </tr>
);

interface RepositoryTableRowProps {
  addon: RepositoryAddon;
}

const RepositoryTableRow: FunctionComponent<RepositoryTableRowProps> = ({
  addon,
}) => (
  <tr>
    <td />
    <td className="addon-table-padded">{addon.name}</td>
    <td>{addon.version}</td>
    <td>
      <StatusWithMessage status={addon.status} message={addon.message} />
    </td>
    <td />
  </tr>
);

interface StatusWithMessageProps {
  status: string;
  message: string;
}

const StatusWithMessage: FunctionComponent<StatusWithMessageProps> = ({
  status,
  message,
}) => {
  const statusClassName = classNames({
    'fd-has-color-status-1': status === 'Ready',
    'fd-has-color-status-3': status === 'Failed',
  });

  const body = (
    <div className="fd-has-padding-xs has-max-width-m has-white-space-normal has-word-break-break-word">
      {message}
    </div>
  );

  const icon = (
    <Icon
      glyph="error"
      size="s"
      className="fd-has-color-status-3 fd-has-margin-left-tiny"
    />
  );

  return (
    <>
      {<span className={statusClassName}>{status}</span>}
      {message && <Popover body={body} control={icon} placement="bottom-end" />}
    </>
  );
};

interface RepositoryTableSegmentProps {
  repository: RepositoryStatus;
  configName: string;
}

const RepositoryTableSegment: FunctionComponent<
  RepositoryTableSegmentProps
> = ({ repository, configName }) => {
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
