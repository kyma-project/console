import React from 'react';
import LuigiClient from '@luigi-project/client';
import { useMicrofrontendContext } from 'react-shared';
import { Panel, Toggle } from 'fundamental-react';

export default function NamespaceSettings() {
  const {
    groups,
    showSystemNamespaces: initialShowSystemNamespaces,
  } = useMicrofrontendContext();

  const [showSystemNamespaces, setShowSystemNamespaces] = React.useState(
    initialShowSystemNamespaces,
  );

  const toggleVisibility = () => {
    LuigiClient.sendCustomMessage({
      id: 'console.showSystemNamespaces',
      showSystemNamespaces: !showSystemNamespaces,
    });
    setShowSystemNamespaces(!showSystemNamespaces);
  };

  const shouldShowNamespaceSettings = () => {
    if (!Array.isArray(groups)) {
      return true;
    }
    return groups.includes('runtimeAdmin');
  };

  return (
    shouldShowNamespaceSettings() && (
      <Panel className="fd-has-margin-tiny fd-has-margin-top-medium">
        <Panel.Header>
          <Panel.Head title="Namespace settings" />
          <Panel.Actions>
            Show System Namespaces
            <Toggle
              inputProps={{ 'aria-label': 'toggle-system-namespaces' }}
              className="fd-has-display-inline-block fd-has-margin-left-tiny"
              checked={showSystemNamespaces}
              onChange={toggleVisibility}
            />
          </Panel.Actions>
        </Panel.Header>
      </Panel>
    )
  );
}
