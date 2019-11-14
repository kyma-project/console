import React, { FunctionComponent } from 'react';
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

interface AddonPanelProps {
  config: Configuration;
}

const AddonPanel: FunctionComponent<AddonPanelProps> = ({ config }) => {
  const panelContent = (
    <>
      {config.labels && <LabelDisplay readonlyLabels={config.labels} />}
      <AddonTable config={config} />
    </>
  );

  const actions = (
    <>
      {config.name !== DEFAULT_CONFIGURATION ? (
        <AddUrlModal configurationName={config.name} />
      ) : null}
      <Button glyph="refresh" option="light" />
      <DeleteConfigurationModal configurationName={config.name} />
    </>
  );

  return (
    <CollapsiblePanel
      title={config.name}
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
