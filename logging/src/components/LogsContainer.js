import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import Logs from './Logs/Logs';

import { QueryTransformServiceContext } from '../services/queryTransformService';
import { HttpServiceContext } from '../services/httpService';
import { PodSubscriptionServiceContext } from '../services/podSubscriptionService';

export default function LogsContainer() {
  const httpService = React.useContext(HttpServiceContext);
  const queryTransformService = React.useContext(QueryTransformServiceContext);
  const podsSubscriptionService = React.useContext(
    PodSubscriptionServiceContext,
  );

  function isCompact() {
    var params = LuigiClient.getNodeParams();
    return !!params.compact;
  }

  function getLabelValuesFromViewParams() {
    const params = LuigiClient.getNodeParams();
    delete params.compact;
    const labels = [];
    for (var paramName in params) {
      labels.push(`${paramName}="${params[paramName]}"`);
    }
    return labels;
  }

  const isCompactMode = isCompact();
  const readOnlyLabels = getLabelValuesFromViewParams();

  return (
    <Logs
      httpService={httpService}
      queryTransformService={queryTransformService}
      podsSubscriptionService={podsSubscriptionService}
      readonlyLabels={readOnlyLabels}
      isCompact={isCompactMode}
    />
  );
}
