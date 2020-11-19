import React from 'react';
import LuigiClient from '@luigi-project/client';
import { getResourceDisplayName } from 'helpers';
import {
  serviceInstanceConstants,
  DOCUMENTATION_PER_PLAN_LABEL,
} from 'helpers/constants';

import { Token } from 'fundamental-react';
import { Link, PageHeader } from 'react-shared';
import './ServiceInstanceInfo.scss';

import { ServiceInstanceStatus } from '../../../shared/ServiceInstanceStatus.js';
import InstanceParametersModal from './InstanceParametersModal';

const ServiceInstanceInfo = ({ serviceInstance }) => {
  const serviceClassDocsPerPlan =
    serviceInstance?.serviceClass?.labels[DOCUMENTATION_PER_PLAN_LABEL] ===
    'true';

  const goToServiceClassDetails = name => {
    const target = serviceClassDocsPerPlan
      ? `cmf-service-catalog/details/${name}/plans`
      : `cmf-service-catalog/details/${name}`;
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(target);
  };

  const goToServiceClassDetailsWithPlan = (name, planName) => {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(`cmf-service-catalog/details/${name}/plan/${planName}`);
  };

  if (!serviceInstance) {
    return null;
  }

  const instanceClass =
    serviceInstance.clusterServiceClass || serviceInstance.serviceClass;
  const instancePlan =
    serviceInstance.clusterServicePlan || serviceInstance.servicePlan;

  const classContent = instanceClass.name ? (
    <button
      className="link has-padding-0 fd-has-type-0"
      data-e2e-id="instance-service-class"
      onClick={() => goToServiceClassDetails(instanceClass.name)}
    >
      {getResourceDisplayName(instanceClass)}
    </button>
  ) : (
    '-'
  );

  const hasLabels = serviceInstance.labels && serviceInstance.labels.length > 0;
  const labels = (
    <ul className="no-dismiss-tokens labels-list" data-e2e-id="instance-labels">
      {serviceInstance.labels.map((label, index) => (
        <Token key={`${label}-${index}`}>{label}</Token>
      ))}
    </ul>
  );

  const documentationLink = instanceClass.documentationUrl && (
    <Link
      url={instanceClass.documentationUrl}
      text={serviceInstanceConstants.link}
      data-e2e-id="instance-service-documentation-link"
    />
  );

  const supportLink = instanceClass.supportUrl && (
    <Link
      url={instanceClass.supportUrl}
      text={serviceInstanceConstants.link}
      data-e2e-id="instance-service-support-link"
    />
  );

  const plan = (() => {
    if (
      serviceInstance.planSpec !== null &&
      typeof serviceInstance.planSpec === 'object' &&
      Object.keys(serviceInstance.planSpec).length
    ) {
      return (
        <InstanceParametersModal
          instancePlan={instancePlan}
          serviceInstance={serviceInstance}
        />
      );
    } else if (serviceClassDocsPerPlan) {
      return (
        <button
          className="link has-padding-0 fd-has-type-0"
          onClick={() =>
            goToServiceClassDetailsWithPlan(
              instanceClass.name,
              instancePlan.name,
            )
          }
        >
          {getResourceDisplayName(instancePlan)}
        </button>
      );
    } else {
      return `${getResourceDisplayName(instancePlan) || '-'}`;
    }
  })();

  const Column = PageHeader.Column;
  return (
    <>
      <Column title={serviceInstanceConstants.statusHeader}>
        <ServiceInstanceStatus instance={serviceInstance} />
      </Column>
      <Column title={serviceInstanceConstants.classHeader}>
        {classContent}
      </Column>
      {hasLabels && (
        <Column title={serviceInstanceConstants.labelsHeader}>{labels}</Column>
      )}
      <Column title={serviceInstanceConstants.planHeader}>
        <div data-e2e-id="instance-service-plan">{plan}</div>
      </Column>
      {documentationLink && (
        <Column title={serviceInstanceConstants.documentationHeader}>
          {documentationLink}
        </Column>
      )}
      {supportLink && (
        <Column title={serviceInstanceConstants.supportHeader}>
          {supportLink}
        </Column>
      )}
    </>
  );
};

export default ServiceInstanceInfo;
