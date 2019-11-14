import React, { FunctionComponent, useContext } from 'react';
import CollapsiblePanel from '../CollapsiblePanel/CollapsiblePanel';
import { Configuration } from '../../types';
import { Button } from 'fundamental-react';
import AddonsConfigurationBadge from './../AddonConfigurationBadge/AddonConfigurationBadge';
import LabelDisplay from './../LabelDisplay/LabelDisplay';
import DeleteConfigurationModal from '../Modals/DeleteConfigurationModal/DeleteConfigurationModal.container';
import AddUrlModal from '../Modals/AddUrlModal/AddUrlModal.container';
import AddonTable from './AddonTable/AddonTable';
import { DEFAULT_CONFIGURATION } from './../../constants';
import './AddonPanel.scss';
import { MutationsService } from '../../services/Mutations.service';
import { NotificationsService } from '@kyma-project/common';

interface ResyncButtonProps {
  configurationName: string;
}

const ResyncButton: FunctionComponent<ResyncButtonProps> = ({
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

const AddonPanel: FunctionComponent<AddonPanelProps> = ({ config }) => {
  const panelTitle =
    config.name === DEFAULT_CONFIGURATION
      ? `${config.name} (default)`
      : config.name;

  const actions = (
    <>
      {config.name !== DEFAULT_CONFIGURATION ? (
        <AddUrlModal configurationName={config.name} />
      ) : null}
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

  return (
    <CollapsiblePanel
      title={panelTitle}
      actions={actions}
      additionalHeaderContent={
        config.status && (
          <AddonsConfigurationBadge
            status={config.status.phase}
            className="fd-has-margin-left-s"
          />
        )
      }
      className="fd-has-margin-bottom-s"
    >
      {panelContent}
    </CollapsiblePanel>
  );
};

export default AddonPanel;
