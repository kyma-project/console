import React from 'react';
import LuigiClient from '@luigi-project/client';

import { useGenericCreate } from 'react-shared';

import './CreateWorkloadForm.scss';
import BasicData from './BasicData';
import ServiceData from './ServiceData';
import ScalingData from './ScalingData';
import {
  formatDeployment,
  formatService,
  createDeploymentTemplate,
} from './helpers';

export default function CreateWorkloadForm({
  namespaceId,
  formElementRef,
  onChange,
  onCompleted,
  onError,
}) {
  const createResource = useGenericCreate();
  const [deployment, setDeployment] = React.useState(
    createDeploymentTemplate(namespaceId),
  );

  const handleFormSubmit = async () => {
    let createdResource = null;
    try {
      createdResource = await createResource(formatDeployment(deployment));
    } catch (e) {
      console.log(e);
      onError('Cannot create deployment', e.message);
      return;
    }
    const createdResourceUID = createdResource?.metadata?.uid;

    try {
      if (deployment.createService && createdResourceUID) {
        await createResource(formatService(deployment, createdResourceUID));
      }
      onCompleted(deployment.name, 'Deployment created');
      LuigiClient.linkManager()
        .fromContext('namespaces')
        .navigate('/deployments');
    } catch (e) {
      onError('Deployment created, could not create service', e.message, true);
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
