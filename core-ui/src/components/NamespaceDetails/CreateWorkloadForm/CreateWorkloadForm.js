import React from 'react';
import LuigiClient from '@luigi-project/client';

import { useGenericCreate } from 'react-shared';

import './CreateWorkloadForm.scss';
import BasicData from './BasicData';
import ServiceData from './ServiceData';
import ScalingData from './ScalingData';
import { formatDeployment, formatService } from './helpers';

export default function CreateWorkloadForm({
  namespaceId,
  formElementRef,
  onChange,
  onCompleted,
  onError,
}) {
  const createResource = useGenericCreate();
  const [deployment, setDeployment] = React.useState({
    name: '',
    namespace: namespaceId,
    createService: true,
    dockerImage: '',
    labels: {},
    requests: {
      memory: '64Mi',
      cpu: '50m',
    },
    limits: {
      memory: '128Mi',
      cpu: '100m',
    },
    port: {
      name: 'http',
      port: 80,
      protocol: 'TCP',
      targetPort: 8080,
    },
  });

  const handleFormSubmit = async () => {
    try {
      const createdResource = await createResource(
        formatDeployment(deployment),
      );
      onCompleted(deployment.name, 'Deployment created');

      const createdResourceUID = createdResource?.metadata?.uid;

      if (deployment.createService && createdResourceUID) {
        await createResource(formatService(deployment, createdResourceUID));
      }
      LuigiClient.linkManager()
        .fromContext('namespaces')
        .navigate('/deployments');
    } catch (e) {
      onError('Cannot create deployment');
    }
  };

  return (
    <>
      <form
        onChange={onChange}
        ref={formElementRef}
        onSubmit={handleFormSubmit}
        className="create-workload-form"
      >
        <div>
          <BasicData deployment={deployment} setDeployment={setDeployment} />
          <ServiceData deployment={deployment} setDeployment={setDeployment} />
        </div>
        <ScalingData deployment={deployment} setDeployment={setDeployment} />
      </form>
      <p className="create-workload-info fd-has-type-2 fd-has-color-text-3">
        For more advanced configuration options, use "Upload YAML" option.
      </p>
    </>
  );
}
