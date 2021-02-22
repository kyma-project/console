import React from 'react';
import LuigiClient from '@luigi-project/client';
import { useMicrofrontendContext } from 'react-shared';
import { Panel, Toggle } from 'fundamental-react';

export default function ExperimentalFunctionalities() {
  const [showExperimentalViews, setShowExperimentalViews] = React.useState(
    useMicrofrontendContext().showExperimentalViews,
  );

  const toggleVisibility = () => {
    LuigiClient.sendCustomMessage({
      id: 'console.showExperimentalViews',
      showExperimentalViews: !showExperimentalViews,
    });
    setShowExperimentalViews(!showExperimentalViews);
  };

  return (
    <Panel className="fd-has-margin-tiny fd-has-margin-top-small">
      <Panel.Header>
        <Panel.Head title="Experimental functionalities" />
        <Panel.Actions>
          Enable all
          <Toggle
            inputProps={{ 'aria-label': 'toggle-experimental' }}
            className="fd-has-display-inline-block fd-has-margin-left-tiny"
            checked={showExperimentalViews}
            onChange={toggleVisibility}
          />
        </Panel.Actions>
      </Panel.Header>
      <Panel.Body>
        Enables all views which expose experimental features in the UI. Refresh
        the page after enabling this option to see additional navigation nodes
        in the <strong>Experimental</strong> category of the left navigation.
      </Panel.Body>
    </Panel>
  );
}
