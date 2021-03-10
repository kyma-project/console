import React from 'react';

import { FormSet, FormLabel, FormInput } from 'fundamental-react';

export default function ScalingData({ deployment, setDeployment }) {
  return (
    <div>
      <h3 className="configuration-data__title">Runtime Profile</h3>
      <FormSet className="configuration-data__form">
        <FormLabel>
          Memory requests
          <FormInput
            defaultValue={deployment.requests.memory}
            onChange={e =>
              setDeployment({
                ...deployment,
                requests: {
                  ...deployment.requests,
                  memory: e.target.value,
                },
              })
            }
          />
        </FormLabel>
        <FormLabel>
          Memory limits
          <FormInput
            defaultValue={deployment.limits.memory}
            onChange={e =>
              setDeployment({
                ...deployment,
                limits: {
                  ...deployment.limits,
                  memory: e.target.value,
                },
              })
            }
          />
        </FormLabel>
      </FormSet>
      <FormSet className="configuration-data__form">
        <FormLabel>
          CPU requests
          <FormInput
            defaultValue={deployment.requests.cpu}
            onChange={e =>
              setDeployment({
                ...deployment,
                requests: {
                  ...deployment.requests,
                  cpu: e.target.value,
                },
              })
            }
          />
        </FormLabel>
        <FormLabel>
          CPU limits
          <FormInput
            defaultValue={deployment.limits.cpu}
            onChange={e =>
              setDeployment({
                ...deployment,
                limits: {
                  ...deployment.limits,
                  cpu: e.target.value,
                },
              })
            }
          />
        </FormLabel>
      </FormSet>
    </div>
  );
}
