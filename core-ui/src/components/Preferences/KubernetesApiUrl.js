import React from 'react';
import LuigiClient from '@luigi-project/client';
import { useMicrofrontendContext } from 'react-shared';
import { Panel, FormInput, Button } from 'fundamental-react';

export default function ExperimentalFunctionalities() {
  const [k8sApiUrl, setK8sApiUrl] = React.useState(
    useMicrofrontendContext().k8sApiUrl,
  );

  const updateApiUrl = () => {
    LuigiClient.sendCustomMessage({
      id: 'console.updateInitParams',
      k8sApiUrl,
    });
  };

  return (
    <Panel className="fd-has-margin-tiny fd-has-margin-top-small">
      <Panel.Header>
        <Panel.Head title="Kubernetes API Url" />
        <Panel.Actions>
          <Button option="emphasized" onClick={updateApiUrl}>
            Update configuration
          </Button>
        </Panel.Actions>
      </Panel.Header>
      <Panel.Body>
        <FormInput
          type="url"
          defaultValue={k8sApiUrl}
          placeholder="Kubernetes API Url"
          onChange={e => setK8sApiUrl(e.target.value)}
        />
      </Panel.Body>
    </Panel>
  );
}
