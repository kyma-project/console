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
      replicas: 1,
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

function formatService(deployment, deploymentUID) {
  if (!deployment.labels.app) {
    deployment.labels.app = deployment.name;
  }

  const service = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: deployment.name,
      namespace: deployment.namespace,
      ownerReferences: [
        {
          kind: 'Deployment',
          apiVersion: 'apps/v1',
          name: deployment.name,
          uid: deploymentUID,
        },
      ],
      //labels: //TODO
    },
    spec: {
      type: 'ClusterIP',
      ports: [
        {
          name: 'http',
          port: deployment.port.port,
          protocol: 'TCP',
          targetPort: deployment.port.targetPort,
        },
      ],
    },
  };
  return service;
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
