import React from 'react';
import { DeploymentPods } from './DeploymentPods.js';

export const DeploymentsDetails = DefaultRenderer => ({ ...otherParams }) => {
  return (
    <DefaultRenderer {...otherParams}>
      {
        <DeploymentPods
          namespace={otherParams.namespace}
          deploymentName={otherParams.resourceName}
        />
      }
    </DefaultRenderer>
  );
};
