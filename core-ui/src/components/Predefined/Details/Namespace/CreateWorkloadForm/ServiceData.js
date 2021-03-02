import React from 'react';

import { TextFormItem } from 'react-shared';
import { FormSet } from 'fundamental-react';

export default function ServiceData({ deployment, setDeployment }) {
  if (!deployment.createService) {
    return null;
  }
  return (
    <FormSet>
      <TextFormItem
        type="number"
        inputKey="port"
        required
        label="Port"
        placeholder="Enter port"
        defaultValue={deployment.port.port}
        onChange={e =>
          setDeployment({
            ...deployment,
            port: { ...deployment.port, port: e.target.valueAsNumber },
          })
        }
      />
      <TextFormItem
        type="number"
        inputKey="target-port"
        required
        label="Target port"
        placeholder="Enter target port"
        defaultValue={deployment.port.targetPort}
        onChange={e =>
          setDeployment({
            ...deployment,
            port: { ...deployment.port, targetPort: e.target.valueAsNumber },
          })
        }
      />
    </FormSet>
  );
}
