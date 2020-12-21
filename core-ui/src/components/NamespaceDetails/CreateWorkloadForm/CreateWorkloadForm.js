import React from 'react';

import { useGenericCreate } from 'react-shared';

import './CreateWorkloadForm.scss';
import BasicData from './BasicData';
import ScalingData from './ScalingData';

function formatDeployment(deployment) {
  if (!deployment.labels.app) {
    deployment.labels.app = deployment.name;
  }

  const runtimeDeployment = {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: deployment.name,
      namespace: deployment.namespace,
      labels: deployment.labels,
    },
    spec: {
      replicas: deployment.replicasMin,
      selector: { matchLabels: deployment.labels },
      template: {
        metadata: { labels: deployment.labels },
        spec: {
          containers: [
            {
              name: deployment.name,
              image: deployment.dockerImage,
              resources: {
                requests: deployment.requests,
                limits: deployment.limits,
              },
            },
          ],
        },
      },
    },
  };
  return runtimeDeployment;
}

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
      await createResource(formatDeployment(deployment));
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
      className="create-workload-form"
    >
      <BasicData deployment={deployment} setDeployment={setDeployment} />
      <ScalingData deployment={deployment} setDeployment={setDeployment} />
    </form>
  );
}
