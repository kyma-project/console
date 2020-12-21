import React from 'react';

import { FormSet, FormLabel, FormInput, InlineHelp } from 'fundamental-react';
import { K8sNameInput, useMicrofrontendContext } from 'react-shared';

import './CreateWorkloadForm.scss';
import { LabelsInput } from 'components/Lambdas/components';

const BasicData = ({ deployment, setDeployment }) => (
  <FormSet>
    <K8sNameInput
      kind="Deployment"
      onChange={e => setDeployment({ ...deployment, name: e.target.value })}
      className="fd-has-margin-bottom-s"
    />
    <LabelsInput
      labels={deployment.labels}
      onChange={labels => setDeployment({ ...deployment, labels })}
    />
    <FormLabel required>
      Docker image
      <InlineHelp
        placement="bottom-right"
        text="Docker image path help here TODO"
      />
    </FormLabel>
    <FormInput
      required
      placeholder="Enter Docker image"
      onChange={e =>
        setDeployment({ ...deployment, dockerImage: e.target.value })
      }
    />
  </FormSet>
);

const ConfigurationData = ({ deployment, setDeployment }) => (
  <div>
    <h3 className="configuration-data__title">Scaling Options</h3>
    <FormSet className="configuration-data__form">
      <FormLabel>
        Minimum replicas
        <FormInput
          type="number"
          min="1"
          max={deployment.replicasMax}
          defaultValue={deployment.replicasMin}
          onChange={e =>
            setDeployment({
              ...deployment,
              replicasMin: e.target.valueAsNumber,
            })
          }
          className="fd-has-margin-bottom-s fd-has-margin-top-xs"
        />
      </FormLabel>

      <FormLabel>
        Maximum replicas
        <FormInput
          className="fd-has-margin-top-xs"
          type="number"
          min={deployment.replicasMin}
          defaultValue={deployment.replicasMax}
          onChange={e =>
            setDeployment({
              ...deployment,
              replicasMax: e.target.valueAsNumber,
            })
          }
        />
      </FormLabel>
    </FormSet>
    <h3 className="configuration-data__title">Resources Profile</h3>
    <FormSet className="configuration-data__form">
      <FormLabel>
        Memory requests
        <FormInput
          defaultValue={deployment.requests.memory}
          // onChange={e =>
          //   setDeployment({
          //     ...deployment,
          //     replicasMin: e.target.valueAsNumber,
          //   })
          // }
        />
      </FormLabel>

      <FormLabel>
        Memory limits
        <FormInput
          defaultValue={deployment.limits.memory}
          // onChange={e =>
          //   setDeployment({
          //     ...deployment,
          //     replicasMax: e.target.valueAsNumber,
          //   })
          // }
        />
      </FormLabel>
    </FormSet>
    <FormSet className="configuration-data__form">
      <FormLabel>
        CPU requests
        <FormInput
          defaultValue={deployment.requests.cpu}
          // onChange={e =>
          //   setDeployment({
          //     ...deployment,
          //     replicasMin: e.target.valueAsNumber,
          //   })
          // }
        />
      </FormLabel>

      <FormLabel>
        CPU limits
        <FormInput
          defaultValue={deployment.limits.cpu}
          // onChange={e =>
          //   setDeployment({
          //     ...deployment,
          //     replicasMax: e.target.valueAsNumber,
          //   })
          // }
        />
      </FormLabel>
    </FormSet>
  </div>
);

export default function CreateWorkloadForm({
  namespaceId,
  formElementRef,
  onChange,
  onCompleted,
  onError,
}) {
  const { idToken: token } = useMicrofrontendContext();
  const [deployment, setDeployment] = React.useState({
    name: '',
    namespace: namespaceId,
    dockerImage: '',
    labels: {},
    replicasMin: 1,
    replicasMax: 1,
    requests: {
      memory: '64Mi',
      cpu: '50m',
    },
    limits: {
      memory: '128Mi',
      cpu: '100m',
    },
  });

  const handleFormSubmit = async () => {
    try {
      const url = 'http://localhost:3001/deployments/create';
      await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deployment),
        method: 'POST',
      });
      onCompleted(deployment.name, 'Deployment created');
    } catch (e) {
      onError('Cannot create deployment');
    }
  };

  return (
    <form
      onChange={onChange}
      ref={formElementRef}
      onSubmit={handleFormSubmit}
      className="fd-has-padding-m create-workload-form"
    >
      <BasicData deployment={deployment} setDeployment={setDeployment} />
      <ConfigurationData
        deployment={deployment}
        setDeployment={setDeployment}
      />
    </form>
  );
}
