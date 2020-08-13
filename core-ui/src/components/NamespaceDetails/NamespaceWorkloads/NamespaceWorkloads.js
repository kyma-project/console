import React from 'react';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';

import { Panel } from 'fundamental-react';
import CircleProgress from 'shared/components/CircleProgress/CircleProgress';
import './NamespaceWorkloads.scss';

import { useSubscription } from 'react-apollo';
import {
  DEPLOYMENT_EVENT_SUBSCRIPTION,
  POD_EVENT_SUBSCRIPTION,
} from 'gql/subscriptions';
import {
  getHealthyPodsCount,
  getHealthyDeploymentsCount,
  handleDeploymentEvent,
  handlePodsEvent,
} from './namespaceWorkloadsHelpers';

NamespaceWorkloads.propTypes = { namespace: PropTypes.object.isRequired };

export default function NamespaceWorkloads({ namespace }) {
  const [pods, setPods] = React.useState(namespace.pods);
  const [deployments, setDeployments] = React.useState(namespace.deployments);

  const navigateTo = destination => () =>
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(destination);

  const { data: deploymentData } = useSubscription(
    DEPLOYMENT_EVENT_SUBSCRIPTION,
    {
      variables: { namespace: namespace.name },
    },
  );

  React.useEffect(
    () => handleDeploymentEvent(deployments, setDeployments, deploymentData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deploymentData],
  );

  const { data: podsData } = useSubscription(POD_EVENT_SUBSCRIPTION, {
    variables: { namespace: namespace.name },
  });

  React.useEffect(
    () => handlePodsEvent(pods, setPods, podsData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [podsData],
  );

  return (
    <Panel className="fd-has-margin-m">
      <Panel.Header>
        <Panel.Head title="Workloads" />
      </Panel.Header>
      <Panel.Body className="namespace-workloads__body">
        <CircleProgress
          onClick={navigateTo('/deployments')}
          color="purple"
          value={getHealthyDeploymentsCount(deployments)}
          max={deployments.length}
        >
          <span className="cursor-pointer">Deployments</span>
        </CircleProgress>
        <CircleProgress
          onClick={navigateTo('/pods')}
          color="green"
          value={getHealthyPodsCount(pods)}
          max={pods.length}
        >
          <span className="cursor-pointer">Pods</span>
        </CircleProgress>
      </Panel.Body>
    </Panel>
  );
}
