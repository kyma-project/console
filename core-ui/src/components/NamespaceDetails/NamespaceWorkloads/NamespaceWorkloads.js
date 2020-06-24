import React from 'react';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';

import { Panel } from 'fundamental-react';
import CircleProgress from 'shared/components/CircleProgress/CircleProgress';
import './NamespaceWorkloads.scss';

export function getDeploymentsRatio({ deployments }) {
  if (!deployments.length) {
    return 0;
  }
  const succesfulDeploymentsCount = deployments.filter(
    d => d.status.replicas === d.status.readyReplicas,
  ).length;

  return succesfulDeploymentsCount / deployments.length;
}

export function getPodsRatio({ pods }) {
  if (!pods.length) {
    return 0;
  }

  const successStatuses = ['RUNNING', 'SUCCEEDED'];

  const succesfulPodsCount = pods.filter(p =>
    successStatuses.includes(p.status),
  ).length;

  return succesfulPodsCount / pods.length;
}

NamespaceWorkloads.propTypes = { namespace: PropTypes.object.isRequired };

export default function NamespaceWorkloads({ namespace }) {
  const formatRatio = ratio => Math.round(ratio * 100);

  const navigateTo = destination => () =>
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(destination);

  return (
    <Panel className="fd-has-margin-m">
      <Panel.Header>
        <Panel.Head title="Workloads" />
      </Panel.Header>
      <Panel.Body className="namespace-workloads__body">
        <CircleProgress
          onClick={navigateTo('/deployments')}
          color="purple"
          value={formatRatio(getDeploymentsRatio(namespace))}
        >
          <span className="cursor-pointer">Deployments</span>
        </CircleProgress>
        <CircleProgress
          onClick={navigateTo('/pods')}
          color="green"
          value={formatRatio(getPodsRatio(namespace))}
        >
          <span className="cursor-pointer">Pods</span>
        </CircleProgress>
      </Panel.Body>
    </Panel>
  );
}
