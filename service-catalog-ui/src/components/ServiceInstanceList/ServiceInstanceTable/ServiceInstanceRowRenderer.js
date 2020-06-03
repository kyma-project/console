import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import { Icon } from 'fundamental-react';
import { Modal, StatusBadge } from 'react-shared';
import {
  LinkButton,
  Link,
  ServiceClassButton,
  ServicePlanButton,
  JSONCode,
  TextOverflowWrapper,
} from './styled';

import { getResourceDisplayName } from 'helpers';
import { DOCUMENTATION_PER_PLAN_LABEL } from 'helpers/constants';
import { getBadgeTypeForStatus } from 'helpers/getBadgeTypeForStatus';

const goToServiceInstanceDetails = name => {
  LuigiClient.linkManager()
    .fromContext('namespaces')
    .navigate(`cmf-instances/details/${name}`);
};

const goToServiceClassDetails = serviceClass => {
  if (
    serviceClass.labels &&
    serviceClass.labels[DOCUMENTATION_PER_PLAN_LABEL] === 'true'
  ) {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(`cmf-service-catalog/details/${serviceClass.name}/plans`);
  } else {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(`cmf-service-catalog/details/${serviceClass.name}`);
  }
};

const goToServiceClassDetailsWithPlan = (serviceClass, plan) => {
  LuigiClient.linkManager()
    .fromContext('namespaces')
    .navigate(`cmf-service-catalog/details/${serviceClass}/plan/${plan}`);
};

const ServiceInstanceName = ({ instance }) => (
  <TextOverflowWrapper>
    <LinkButton data-e2e-id="instance-name">
      <Link
        onClick={() => goToServiceInstanceDetails(instance.name)}
        data-e2e-id={`instance-name-${instance.name}`}
        title={instance.name}
      >
        {instance.name}
      </Link>
    </LinkButton>
  </TextOverflowWrapper>
);

const ServiceClassName = ({ instance }) => {
  const instanceClass = instance.clusterServiceClass || instance.serviceClass;
  if (!instanceClass || !instanceClass.name) {
    return '-';
  }

  const classTitle = getResourceDisplayName(instanceClass);
  return (
    <TextOverflowWrapper>
      <ServiceClassButton
        onClick={() => goToServiceClassDetails(instanceClass)}
        title={classTitle}
      >
        {classTitle}
      </ServiceClassButton>
    </TextOverflowWrapper>
  );
};

const Plan = ({ instance }) => {
  const plan = instance.clusterServicePlan || instance.servicePlan;
  if (!plan) {
    return '-';
  }
  const instanceClass = instance.clusterServiceClass || instance.serviceClass;
  const serviceClassDocsPerPlan =
    instance.serviceClass &&
    instance.serviceClass.labels &&
    instance.serviceClass.labels[DOCUMENTATION_PER_PLAN_LABEL] === 'true';
  const planDisplayName = getResourceDisplayName(plan);

  if (
    instance.planSpec &&
    instance.planSpec !== null &&
    typeof instance.planSpec === 'object' &&
    Object.keys(instance.planSpec).length
  ) {
    return (
      <TextOverflowWrapper>
        <Modal
          title="Instance's Parameters"
          modalOpeningComponent={
            <ServicePlanButton data-e2e-id="service-plan">
              {planDisplayName} <Icon glyph="detail-view" size="s" />
            </ServicePlanButton>
          }
          confirmText="Close"
        >
          <JSONCode data-e2e-id="service-plan-content">
            {JSON.stringify(instance.planSpec, null, 2)}
          </JSONCode>
        </Modal>
      </TextOverflowWrapper>
    );
  }
  return (
    <TextOverflowWrapper>
      {serviceClassDocsPerPlan ? (
        <ServicePlanButton
          data-e2e-id="service-plan"
          onClick={() =>
            goToServiceClassDetailsWithPlan(instanceClass.name, plan.name)
          }
        >
          {planDisplayName}
        </ServicePlanButton>
      ) : (
        <span data-e2e-id="service-plan">{planDisplayName}</span>
      )}
    </TextOverflowWrapper>
  );
};

const BindingUsagesCount = ({ instance }) => {
  const capitalize = str =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const displayBindingsUsages = (bindings = []) => {
    if (!bindings) return null;

    switch (bindings.length) {
      case 0:
        return '-';
      case 1:
        return `${bindings[0].usedBy.name} (${capitalize(
          bindings[0].usedBy.kind,
        )})`;
      default:
        return `Multiple (${bindings.length})`;
    }
  };

  return (
    <TextOverflowWrapper>
      {displayBindingsUsages(instance.serviceBindingUsages)}
    </TextOverflowWrapper>
  );
};

const Status = ({ instance }) => {
  instance.status = undefined;
  const type = instance.status ? instance.status.type : 'UNKNOWN';
  return (
    <StatusBadge
      tooltipContent={instance.status?.message}
      type={getBadgeTypeForStatus(type)}
    >
      {type}
    </StatusBadge>
  );
};

export default function renderRow(
  instance,
  serviceCatalogAddonsBackendModuleExists,
) {
  return [
    <ServiceInstanceName instance={instance} />,
    <ServiceClassName instance={instance} />,
    <Plan instance={instance} />,
    ...(serviceCatalogAddonsBackendModuleExists
      ? [<BindingUsagesCount instance={instance} />]
      : []),
    <Status instance={instance} />,
  ];
}
