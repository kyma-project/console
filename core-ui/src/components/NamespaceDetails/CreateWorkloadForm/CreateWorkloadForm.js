import React from 'react';

import { useMicrofrontendContext } from 'react-shared';

import './CreateWorkloadForm.scss';
import BasicData from './BasicData';
import ScalingData from './ScalingData';

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
    console.log(deployment);
    // try {
    //   const url = 'http://localhost:3001/deployments/create';
    //   await fetch(url, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(deployment),
    //     method: 'POST',
    //   });
    //   onCompleted(deployment.name, 'Deployment created');
    // } catch (e) {
    //   onError('Cannot create deployment');
    // }
  };

  return (
    <form
      onChange={onChange}
      ref={formElementRef}
      onSubmit={handleFormSubmit}
      className="create-workload-form"
    >
      <BasicData deployment={deployment} setDeployment={setDeployment} />
      <ScalingData deployment={deployment} setDeployment={setDeployment} />
    </form>
  );
}
