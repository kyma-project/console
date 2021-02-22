import React from 'react';
import LuigiClient from '@luigi-project/client';
import { useMicrofrontendContext } from 'react-shared';
import { Panel, Toggle, Button } from 'fundamental-react';

export default function AdditionalSettings() {
  const [bebEnabled, setBebEnabled] = React.useState(
    useMicrofrontendContext().bebEnabled,
  );

  const updateApiUrl = () => {
    LuigiClient.sendCustomMessage({
      id: 'console.updateInitParams',
      bebEnabled,
    });
  };

  return (
    <Panel className="fd-has-margin-tiny fd-has-margin-top-small">
      <Panel.Header>
        <Panel.Head title="Additional Settings" />
        <Panel.Actions>
          <Button option="emphasized" onClick={updateApiUrl}>
            Update configuration
          </Button>
        </Panel.Actions>
      </Panel.Header>
      <Panel.Body>
        <div
          className="fd-has-display-flex"
          style={{ justifyContent: 'space-between' }}
        >
          BEB integration enabled
          <Toggle
            inputProps={{ 'aria-label': 'beb-enabled' }}
            checked={bebEnabled}
            onChange={() => setBebEnabled(!bebEnabled)}
          />
        </div>
      </Panel.Body>
    </Panel>
  );
}
