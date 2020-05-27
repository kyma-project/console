import React, { useContext, useState } from 'react';
import CollapsiblePanel from '../CollapsiblePanel/CollapsiblePanel';
import { Configuration } from '../../types';
import { Button } from 'fundamental-react';
import LabelDisplay from './../LabelDisplay/LabelDisplay';
import DeleteConfigurationModal from '../Modals/DeleteConfigurationModal/DeleteConfigurationModal.container';
import AddUrlModal from '../Modals/AddUrlModal/AddUrlModal.container';
import AddonTable from './AddonTable/AddonTable';
import { DEFAULT_CONFIGURATION } from './../../constants';
import './AddonPanel.scss';
import { MutationsService } from '../../services/Mutations.service';
import { NotificationsService } from '@kyma-project/common';
import * as ReactShared from '../../react-shared';

interface ResyncButtonProps {
  configurationName: string;
}

const ResyncButton: React.FunctionComponent<ResyncButtonProps> = ({
  configurationName,
}) => {
  const {
    resyncAddonsConfiguration: [resyncAddonsConfiguration],
  } = useContext(MutationsService);
  const { errorNotification } = useContext(NotificationsService);

  async function handleResync() {
    try {
      await resyncAddonsConfiguration({
        variables: {
          name: configurationName,
        },
      });
    } catch (e) {
      errorNotification({
        title: 'Error',
        content: `Error while resyncing configuration ${configurationName}.`,
      });
    }
  }

  return <Button glyph="refresh" option="light" onClick={handleResync} />;
};

interface AddonPanelProps {
  config: Configuration;
}

const AddonPanel: React.FunctionComponent<AddonPanelProps> = ({ config }) => {
  const isConfigManaged = !config.labels
    ? undefined
    : Object.keys(config.labels)
        .filter(label => label.endsWith('managed')) // find keys ending with 'managed' - DNS prefix can be omitted
        .some(label => config.labels[label] === 'true');

  const isConfigDefault = config.name === DEFAULT_CONFIGURATION;

  const [isOpen, setIsOpen] = useState(true);

  const panelTitle = isConfigDefault ? `${config.name} (default)` : config.name;

  const showAddUrlButton = !isConfigManaged && !isConfigDefault;

  const actions = (
    <>
      {showAddUrlButton && <AddUrlModal configurationName={config.name} />}
      <ResyncButton configurationName={config.name} />
      <DeleteConfigurationModal configurationName={config.name} />
    </>
  );

  const panelContent = (
    <>
      {config.labels && <LabelDisplay readonlyLabels={config.labels} />}
      <AddonTable config={config} />
    </>
  );

  const hasRepositories = config.repositories.length > 0;

  return (
    <CollapsiblePanel
      title={panelTitle}
      actions={actions}
      isOpen={hasRepositories && isOpen}
      setIsOpen={setIsOpen}
      collapseDisabled={!hasRepositories}
      additionalHeaderContent={
        <ReactShared.StatusBadge
          autoResolveType={true}
          className="fd-has-margin-left-s"
          status={config.status.phase}
        />
      }
      className="fd-has-margin-bottom-s addon-collapsible-panel"
    >
      {panelContent}
    </CollapsiblePanel>
  );
};

export default AddonPanel;
