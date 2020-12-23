import React from 'react';

import { FormSet, FormLabel, FormInput } from 'fundamental-react';

const PortInput = ({ label, placeholder, value, onChange }) => {
  return (
    <>
      <FormLabel required>{label}</FormLabel>
      <FormInput
        required
        type="number"
        min="0"
        placeholder={placeholder}
        defaultValue={value}
        onChange={e => onChange(e.target.value)}
        className="fd-has-margin-bottom-s"
      />
    </>
  );
};

export default function ServiceData({ deployment, setDeployment }) {
  if (!deployment.createService) {
    return null;
  }
  return (
    <FormSet>
      <PortInput
        label="Port"
        placeholder="Enter port"
        value={deployment.port.port}
        onChange={port =>
          setDeployment({
            ...deployment,
            port: { ...deployment.port, port },
          })
        }
      />
      <PortInput
        label="Target Port"
        placeholder="Enter target port"
        value={deployment.port.targetPort}
        onChange={targetPort =>
          setDeployment({
            ...deployment,
            port: { ...deployment.port, targetPort },
          })
        }
      />
    </FormSet>
  );
}
